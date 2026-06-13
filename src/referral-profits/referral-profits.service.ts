import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Referral } from '../referrals/schemas/referrals.schema';
import { Order } from '../orders/schemas/order.schema';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class ReferralProfitsService {
  private readonly logger = new Logger(ReferralProfitsService.name);
  constructor(
    @InjectModel(Referral.name)
    private readonly referralModel: Model<Referral>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
  ) {}
  async calculateReferralProfits(fromUserId: string) {
    this.logger.log(
      `🔁 Binary profit calculation started from user=${fromUserId}`,
    );

    /**
     * 🔁 محاسبه حجم کل یک زیرشاخه (بازگشتی)
     */
    const calculateSubtreeVolume = async (
      userId: Types.ObjectId,
    ): Promise<number> => {
      let total = 0;

      // 🔹 سرمایه‌گذاری فعال خود این کاربر
      const investments = await this.orderModel.find({
        user: userId,
        status: 'paid',
      });

      const totalActiveInvestment = (investments || [])
        .filter((i) => i.status === 'paid')
        .reduce((sum, i) => sum + Number(i.totalPrice || 0), 0);

      total += investments.reduce(
        (sum, inv) => sum + Number(inv.totalPrice || 0),
        0,
      );

      // 🔹 فرزندان مستقیم
      const children = await this.referralModel.find({
        parent: userId,
      });

      for (const child of children) {
        total += await calculateSubtreeVolume(
          child.referredUser as Types.ObjectId,
        );
      }

      return total;
    };

    let currentUserId = new Types.ObjectId(fromUserId);
    let level = 1;

    while (true) {
      // ⬆️ پیدا کردن والد
      const uplink = await this.referralModel.findOne({
        referredUser: currentUserId,
      });

      if (!uplink || !uplink.parent) {
        this.logger.log(`🛑 Reached root at level ${level}`);
        break;
      }

      const parentId = uplink.parent as Types.ObjectId;

      this.logger.log(
        `⬆️ Level ${level} | child=${currentUserId} → parent=${parentId}`,
      );

      // 🔍 فرزندان چپ و راست
      const children = await this.referralModel.find({
        parent: parentId,
      });

      const leftChild = children.find((c) => c.position === 'left');
      const rightChild = children.find((c) => c.position === 'right');

      const leftVolume = leftChild
        ? await calculateSubtreeVolume(leftChild.referredUser as Types.ObjectId)
        : 0;

      const rightVolume = rightChild
        ? await calculateSubtreeVolume(
            rightChild.referredUser as Types.ObjectId,
          )
        : 0;

      this.logger.log(
        `📊 Level ${level} | Parent=${parentId} | Left=${leftVolume} | Right=${rightVolume}`,
      );

      // ============================
      // ✅ منطق جدید Carry Forward
      // ============================

      const parentUser = await this.usersService.findById(parentId.toString());

      if (!parentUser) {
        throw new Error('Parent user not found');
      }

      if (!parentUser.binaryMatched) {
        parentUser.binaryMatched = { left: 0, right: 0 };
      }

      const availableLeft = Math.max(
        0,
        leftVolume - parentUser.binaryMatched.left,
      );

      const availableRight = Math.max(
        0,
        rightVolume - parentUser.binaryMatched.right,
      );

   // ============================
// LEVEL CONFIG
// ============================

let requiredVolume = 3000000;
let profitPercent = 20;
let weeklyCap = 25000000;

switch (parentUser.level) {
  case 'PROFESSIONAL':
    requiredVolume = 9000000;
    profitPercent = 19;
    weeklyCap = 40000000;
    break;

  case 'LEADER':
    requiredVolume = 15000000;
    profitPercent = 18;
    weeklyCap = 75000000;
    break;

  case 'STARTER':
  default:
    requiredVolume = 3000000;
    profitPercent = 20;
    weeklyCap = 25000000;
    break;
}

// ضعیف ترین لاین
const weakLegVolume = Math.min(
  availableLeft,
  availableRight,
);

// آیا شرایط دریافت پورسانت را دارد؟
const eligibleForCommission =
  availableLeft >= requiredVolume &&
  availableRight >= requiredVolume;

let reward = 0;
let usedVolume = 0;

if (eligibleForCommission) {
  reward = Math.floor(
    (weakLegVolume * profitPercent) / 100,
  );

  // سقف درآمد هفتگی
  const currentWeekIncome =
    parentUser.maxEarningInWeek || 0;

  const remainingCap =
    weeklyCap - currentWeekIncome;

  reward = Math.min(
    reward,
    Math.max(0, remainingCap),
  );

  usedVolume = weakLegVolume;
}

if (reward > 0) {
  parentUser.binaryMatched.left += usedVolume;
  parentUser.binaryMatched.right += usedVolume;

  parentUser.pairCycle += 1;

  parentUser.referralBalance += reward;

  parentUser.maxEarningInWeek =
    (parentUser.maxEarningInWeek || 0) + reward;

  // ==========================
  // LEVEL UPGRADE
  // ==========================

  if (
    parentUser.referralBalance >= 300000000
  ) {
    parentUser.level = 'LEADER' as any;
  } else if (
    parentUser.referralBalance >= 100000000
  ) {
    parentUser.level = 'PROFESSIONAL' as any;
  } else {
    parentUser.level = 'STARTER' as any;
  }

  await parentUser.save();

  await this.usersService.addBalance(
    parentId.toString(),
    'totalIncome',
    reward,
  );

  await this.usersService.addBalance(
    parentId.toString(),
    'totalBalance',
    reward,
  );

  await this.transactionsService.createTransaction({
    userId: parentId.toString(),
    type: 'binary-profit',
    amount: reward,
    status: 'completed',
    note: `
      Binary Profit
      Level=${parentUser.level}
      Percent=${profitPercent}
      Left=${availableLeft}
      Right=${availableRight}
      WeakLeg=${weakLegVolume}
      Reward=${reward}
    `,
  });
}

      // ⬆️ برو بالا
      currentUserId = parentId;
      level++;
    }

    this.logger.log('✅ Binary profit calculation completed');
  }
}
