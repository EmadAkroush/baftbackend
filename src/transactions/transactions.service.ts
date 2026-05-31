import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from './schemas/transactions.schema';

import { User } from '../users/schemas/user.schema';

import mongoose from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // =====================================
  // CREATE GENERIC TRANSACTION
  // =====================================

  async createTransaction(data: Partial<Transaction>) {
    const transaction =
      new this.transactionModel(data);

    return transaction.save();
  }

  // =====================================
  // ADMIN
  // =====================================

  async getAllTransactionsForAdmin() {
    return this.transactionModel
      .find()
      .populate(
        'userId',
        'name family phone referralCode',
      )
      .sort({ createdAt: -1 })
      .lean();
  }

  // =====================================
  // USER TRANSACTIONS
  // =====================================

  async getUserTransactions(
    userId: string,
  ) {
    return this.transactionModel
      .find({
        userId: new mongoose.Types.ObjectId(
          userId,
        ),
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getTransactionById(id: string) {
    const transaction =
      await this.transactionModel.findById(
        id,
      );

    if (!transaction) {
      throw new NotFoundException(
        'Transaction not found',
      );
    }

    return transaction;
  }

  // =====================================
  // PRODUCT PURCHASE
  // =====================================

  async createPurchaseTransaction(
    userId: string,
    amount: number,
    orderId: string,
  ) {
    return this.transactionModel.create({
      userId,

      amount,

      orderId,

      type:
        TransactionType.PRODUCT_PURCHASE,

      status:
        TransactionStatus.COMPLETED,
    });
  }

  // =====================================
  // REFERRAL BONUS
  // =====================================

  async createReferralBonus(
    userId: string,
    amount: number,
    relatedUserId?: string,
  ) {
    const user =
      await this.userModel.findById(userId);

    if (!user)
      throw new NotFoundException(
        'User not found',
      );

    user.referralBalance += amount;

    user.totalIncome += amount;

    user.totalBalance += amount;

    await user.save();

    return this.transactionModel.create({
      userId,

      amount,

      relatedUserId,

      type:
        TransactionType.REFERRAL_BONUS,

      status:
        TransactionStatus.COMPLETED,
    });
  }

  // =====================================
  // PAIR BONUS
  // =====================================

  async createPairBonus(
    userId: string,
    amount: number,
    leftVolume: number,
    rightVolume: number,
    pairCycle: number,
  ) {
    const user =
      await this.userModel.findById(userId);

    if (!user)
      throw new NotFoundException(
        'User not found',
      );

    user.bonusBalance += amount;

    user.totalIncome += amount;

    user.totalBalance += amount;

    await user.save();

    return this.transactionModel.create({
      userId,

      amount,

      leftVolume,

      rightVolume,

      pairCycle,

      type:
        TransactionType.PAIR_BONUS,

      status:
        TransactionStatus.COMPLETED,
    });
  }

  // =====================================
  // RANK BONUS
  // =====================================

  async createRankBonus(
    userId: string,
    amount: number,
  ) {
    const user =
      await this.userModel.findById(userId);

    if (!user)
      throw new NotFoundException(
        'User not found',
      );

    user.bonusBalance += amount;

    user.totalIncome += amount;

    user.totalBalance += amount;

    await user.save();

    return this.transactionModel.create({
      userId,

      amount,

      type:
        TransactionType.RANK_BONUS,

      status:
        TransactionStatus.COMPLETED,
    });
  }

  // =====================================
  // MANUAL BONUS
  // =====================================

  async createManualBonus(
    userId: string,
    amount: number,
    note?: string,
  ) {
    return this.transactionModel.create({
      userId,

      amount,

      note,

      type:
        TransactionType.MANUAL_BONUS,

      status:
        TransactionStatus.COMPLETED,
    });
  }

  // =====================================
  // WITHDRAW REQUEST
  // =====================================

  async requestWithdrawal(
    userId: string,
    amount: number,
  ) {
    if (amount <= 0) {
      throw new BadRequestException(
        'Invalid amount',
      );
    }

    const user =
      await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    if (user.mainBalance < amount) {
      throw new BadRequestException(
        'Insufficient balance',
      );
    }

    return this.transactionModel.create({
      userId,

      amount,

      type:
        TransactionType.WITHDRAWAL,

      status:
        TransactionStatus.PENDING,
    });
  }

  // =====================================
  // APPROVE WITHDRAW
  // =====================================

  async approveWithdrawal(
    transactionId: string,
    adminId: string,
  ) {
    const transaction =
      await this.transactionModel.findById(
        transactionId,
      );

    if (!transaction) {
      throw new NotFoundException(
        'Transaction not found',
      );
    }

    if (
      transaction.status !==
      TransactionStatus.PENDING
    ) {
      throw new BadRequestException(
        'Transaction already processed',
      );
    }

    const user =
      await this.userModel.findById(
        transaction.userId,
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    user.mainBalance -=
      transaction.amount;

    user.withdrawalTotalBalance +=
      transaction.amount;

    await user.save();

    transaction.status =
      TransactionStatus.APPROVED;

    transaction.approvedBy =
      new mongoose.Types.ObjectId(
        adminId,
      );

    transaction.approvedAt =
      new Date();

    await transaction.save();

    return transaction;
  }

  // =====================================
  // REJECT WITHDRAW
  // =====================================

  async rejectWithdrawal(
    transactionId: string,
    adminId: string,
  ) {
    const transaction =
      await this.transactionModel.findById(
        transactionId,
      );

    if (!transaction) {
      throw new NotFoundException(
        'Transaction not found',
      );
    }

    transaction.status =
      TransactionStatus.REJECTED;

    transaction.approvedBy =
      new mongoose.Types.ObjectId(
        adminId,
      );

    transaction.approvedAt =
      new Date();

    await transaction.save();

    return transaction;
  }

  // =====================================
  // FINANCIAL SUMMARY
  // =====================================

  async getUserFinancialSummary(
    userId: string,
  ) {
    const user =
      await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return {
      mainBalance:
        user.mainBalance,

      maxCapBalance:
        user.maxCapBalance,

      referralBalance:
        user.referralBalance,

      bonusBalance:
        user.bonusBalance,

      totalIncome:
        user.totalIncome,

      totalBalance:
        user.totalBalance,

      withdrawalTotalBalance:
        user.withdrawalTotalBalance,
    };
  }

  // =====================================
  // CHARTS
  // =====================================

  async getBonusChart() {
    return this.transactionModel.aggregate([
      {
        $match: {
          type: {
            $in: [
              TransactionType.REFERRAL_BONUS,
              TransactionType.PAIR_BONUS,
              TransactionType.RANK_BONUS,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            $month: '$createdAt',
          },
          total: {
            $sum: '$amount',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }

  async getWithdrawalChart() {
    return this.transactionModel.aggregate([
      {
        $match: {
          type:
            TransactionType.WITHDRAWAL,
        },
      },
      {
        $group: {
          _id: {
            $month: '$createdAt',
          },
          total: {
            $sum: '$amount',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }
}