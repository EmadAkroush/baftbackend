import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User, UserDocument, UserLevel } from './schemas/user.schema';

type BalanceField =
  | 'mainBalance'
  | 'maxCapBalance'
  | 'withdrawalTotalBalance'
  | 'referralBalance'
  | 'bonusBalance'
  | 'totalIncome'
  | 'totalBalance';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // =========================
  // CREATE
  // =========================
 async create(data: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  // =========================
  // FIND
  // =========================

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findByReferralCode(referralCode: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ referralCode }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  // =========================
  // UPDATE USER
  // =========================

  async updateUser(userId: string, data: Partial<User>): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null,
      ),
    );

    Object.assign(user, cleanData);

    await user.save({
      validateModifiedOnly: true,
    });

    return user;
  }

  // =========================
  // DELETE USER
  // =========================

  async deleteUser(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userModel.findByIdAndDelete(id);
  }

  // =========================
  // PASSWORD
  // =========================

  async updatePassword(
    userId: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (!newPassword || !confirmPassword) {
      throw new BadRequestException('Password is required');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return {
      message: 'Password updated successfully',
    };
  }

  // =========================
  // BALANCES
  // =========================

  async addBalance(
    userId: string,
    type: BalanceField,
    amount: number,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user[type] = (user[type] ?? 0) + amount;

    await user.save();

    return user;
  }

  async addReferralBalance(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.referralBalance += amount;

    user.totalIncome += amount;

    user.totalBalance += amount;

    await user.save();

    return user;
  }


  // =========================
  // MLM DATA
  // =========================





  // =========================
  // USER LEVEL
  // =========================

  async updateLevel(userId: string, level: UserLevel) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.level = level;

    await user.save();

    return user;
  }

  // =========================
  // LOGIN
  // =========================

  async updateLastLogin(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        lastLogin: new Date(),
      },
      {
        new: true,
      },
    );
  }

  // =========================
  // DASHBOARD BALANCES
  // =========================

  async getUserBalances(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      mainBalance: user.mainBalance,

      maxCapBalance: user.maxCapBalance,

      withdrawalTotalBalance: user.withdrawalTotalBalance,

      referralBalance: user.referralBalance,

      bonusBalance: user.bonusBalance,

      totalIncome: user.totalIncome,

      totalBalance: user.totalBalance,
    };
  }
}
