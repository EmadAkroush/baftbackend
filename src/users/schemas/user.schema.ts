// src/modules/users/schemas/user.schema.ts

import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type UserDocument =
  HydratedDocument<User>;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserLevel {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  LEADER = 'LEADER',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    trim: true,
  })
  family!: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  phone!: string;

  @Prop({
    enum: UserLevel,
    default: UserLevel.STARTER,
  })
  level!: UserLevel;

  @Prop({
    default: 0,
  })
  reward!: number;

  @Prop({
    unique: true,
    required: true,
    index: true,
  })
  referralCode!: string;

  @Prop({
    default: null,
  })
  referredBy!: string;

  @Prop()
  zipcode!: string;

  @Prop()
  province!: string;

  @Prop()
  city!: string;

  @Prop({
    default: false,
  })
  active!: boolean;

  @Prop({
    type: [String],
    default: [],
  })
  shaba!: string[];

  @Prop({
    default: false,
  })
  authentication!: boolean;

  @Prop()
  idCard!: string;

  @Prop({
    default: 0,
  })
  orders!: number;

  @Prop({
    default: 0,
  })
  leftHand!: number;

  @Prop({
    default: 0,
  })
  rightHand!: number;

  @Prop({
    default: 0,
  })
  teamOrders!: number;

  @Prop()
  otp!: string;

  @Prop()
  avatar!: string;

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
  withdrawalTotalBalance!: number;

  @Prop({
    default: 0,
  })
  pairCycle!: number;

  @Prop({
    default: 0,
  })
  maxCapBalanceWeek!: number;

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

  @Prop()
  refreshToken!: string;

  @Prop()
  verificationToken!: string;

  @Prop({
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Prop()
  lastLogin!: Date;
}

export const UserSchema =
  SchemaFactory.createForClass(User);