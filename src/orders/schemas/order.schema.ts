import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
  collection: 'orders',
})
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: string;

  @Prop({
    required: true,
    min: 1,
  })
  quantity: number;

  @Prop({
    required: true,
  })
  unitPrice: number;

  @Prop({
    default: 0,
  })
  discountAmount: number;

  @Prop({
    required: true,
  })
  totalPrice: number;

  @Prop()
  selectedColor: string;

  @Prop()
  selectedSize: string;

  @Prop({
    default: 'pending',
    enum: [
      'pending',
      'paid',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ],
  })
  status: string;

  @Prop({
    default: null,
  })
  trackingCode: string;

  @Prop({
    default: null,
  })
  shippingMethod: string;

  @Prop({
    default: null,
  })
  note: string;

  @Prop({
    default: null,
  })
  paymentTransactionId: string;
}

export const OrderSchema =
  SchemaFactory.createForClass(Order);