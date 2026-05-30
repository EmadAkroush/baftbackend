import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User, UserLevel } from './schemas/user.schema';

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
    private readonly userModel: Model<User>,
  ) {}

  // =========================
  // CREATE
  // =========================

  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel({
      ...data,

      active: true,

      authentication: false,

      level: 'STARTER',

      reward: 0,

      leftHand: 0,

      rightHand: 0,

      teamOrders: 0,

      orders: 0,

      pairCycle: 0,

      mainBalance: 0,

      maxCapBalance: 0,

      maxCapBalanceWeek: 0,

      withdrawalTotalBalance: 0,

      referralBalance: 0,

      bonusBalance: 0,

      totalIncome: 0,

      totalBalance: 0,
    });

    return user.save();
  }

  // =========================
  // FIND
  // =========================

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findByReferralCode(referralCode: string): Promise<User | null> {
    return this.userModel.findOne({ referralCode }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  // =========================
  // UPDATE USER
  // =========================

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
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

  async addBonusBalance(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.bonusBalance += amount;

    user.totalIncome += amount;

    user.totalBalance += amount;

    await user.save();

    return user;
  }

  // =========================
  // MLM DATA
  // =========================

  async increaseLeftHand(userId: string, volume: number) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.leftHand += volume;

    await user.save();

    return user;
  }

  async increaseRightHand(userId: string, volume: number) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.rightHand += volume;

    await user.save();

    return user;
  }

  async increaseTeamOrders(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.teamOrders += amount;

    await user.save();

    return user;
  }

  async increasePairCycle(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.pairCycle += 1;

    await user.save();

    return user;
  }

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
