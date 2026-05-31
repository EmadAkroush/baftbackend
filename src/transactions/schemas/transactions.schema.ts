// src/modules/transactions/schemas/transaction.schema.ts

import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TransactionDocument =
  Transaction & Document;

export enum TransactionType {
  PRODUCT_PURCHASE = 'PRODUCT_PURCHASE',

  WITHDRAWAL = 'WITHDRAWAL',

  REFERRAL_BONUS = 'REFERRAL_BONUS',

  PAIR_BONUS = 'PAIR_BONUS',

  RANK_BONUS = 'RANK_BONUS',

  WEEKLY_BONUS = 'WEEKLY_BONUS',

  MANUAL_BONUS = 'MANUAL_BONUS',

  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',

  APPROVED = 'APPROVED',

  REJECTED = 'REJECTED',

  COMPLETED = 'COMPLETED',
}

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({
    enum: TransactionType,
    required: true,
    index: true,
  })
  type!: TransactionType;

  @Prop({
    required: true,
    min: 0,
  })
  amount!: number;

  @Prop({
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @Prop({
    default: 'IRR',
  })
  currency!: string;

  // شناسه سفارش
  @Prop({
    default: null,
  })
  orderId?: string;

  // کاربر مرتبط با پورسانت
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  relatedUserId?: mongoose.Types.ObjectId;

  // تعداد زوج محاسبه شده
  @Prop({
    default: 0,
  })
  pairCycle?: number;

  // حجم سمت چپ
  @Prop({
    default: 0,
  })
  leftVolume?: number;

  // حجم سمت راست
  @Prop({
    default: 0,
  })
  rightVolume?: number;

  // توضیحات
  @Prop({
    default: '',
  })
  note?: string;

  // ادمین تایید کننده
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  approvedBy?: mongoose.Types.ObjectId;

  @Prop({
    default: null,
  })
  approvedAt?: Date;
}

export const TransactionSchema =
  SchemaFactory.createForClass(
    Transaction,
  );