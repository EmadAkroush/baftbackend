import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

export enum UserLevel {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  LEADER = 'LEADER',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({
  timestamps: true,
})
export class User {
  // ===== Profile =====

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  family!: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  phone!: string;

  @Prop({
    unique: true,
    sparse: true,
  })
  nationalCode!: string;

  @Prop()
  province!: string;

  @Prop()
  city!: string;

  @Prop()
  zipcode!: string;

  @Prop()
  avatar!: string;

  @Prop()
  idCard!: string;

  // ===== Authentication =====

  @Prop()
  password!: string;

  @Prop()
  otp!: string;

  @Prop()
  refreshToken!: string;

  @Prop()
  verificationToken!: string;

  @Prop({
    default: false,
  })
  authentication!: boolean;

  @Prop({
    default: false,
  })
  isVerified!: boolean;

  // ===== Referral =====

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  referralCode!: string;

  @Prop()
  referredBy!: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  referrals!: mongoose.Types.ObjectId[];

  // ===== MLM Position =====

  @Prop({
    default: 0,
  })
  leftVolume!: number;

  @Prop({
    default: 0,
  })
  rightVolume!: number;

  @Prop({
    default: 0,
  })
  teamOrders!: number;

  @Prop({
    default: 0,
  })
  orders!: number;

  @Prop({
    type: {
      left: { type: Number, default: 0 },
      right: { type: Number, default: 0 },
    },
    default: { left: 0, right: 0 },
  })
  binaryMatched!: {
    left: number;
    right: number;
  };

  @Prop({
    default: 0,
  })
  pairCycle!: number;

  // ===== Level =====

  @Prop({
    enum: UserLevel,
    default: UserLevel.STARTER,
  })
  level!: UserLevel;

  // ===== Wallet =====

  @Prop({
    default: 0,
  })
  mainBalance!: number;

  @Prop({
    default: 0,
  })
  maxCapBalance!: number;

  @Prop({
    default: 0,
  })
  maxCapBalanceWeek!: number;

  @Prop({
    default: 0,
  })
  withdrawalTotalBalance!: number;

  @Prop({
    default: 0,
  })
  referralBalance!: number;

  @Prop({
    default: 0,
  })
  bonusBalance!: number;

  @Prop({
    default: 0,
  })
  totalIncome!: number;

  @Prop({
    default: 0,
  })
  totalBalance!: number;

  // ===== Bank =====

  @Prop({
    type: [String],
    default: [],
  })
  shaba!: string[];

  // ===== Status =====

  @Prop({
    default: true,
  })
  active!: boolean;

  @Prop({
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Prop({
    default: Date.now,
  })
  lastLogin!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
