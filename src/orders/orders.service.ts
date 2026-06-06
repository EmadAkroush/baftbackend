import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Order } from './schemas/order.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,

    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(data: any) {
    const product =
      await this.productModel.findById(
        data.productId,
      );

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    const unitPrice =
      product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    const totalPrice =
      unitPrice * data.quantity;

    return this.orderModel.create({
      userId: data.userId,
      productId: data.productId,
      quantity: data.quantity,

      unitPrice,
      totalPrice,

      discountAmount:
        product.price - unitPrice,

      selectedColor:
        data.selectedColor || null,

      selectedSize:
        data.selectedSize || null,

      shippingMethod:
        product.shippingMethod,

      note: data.note,
    });
  }

  async findAll() {
    return this.orderModel
      .find()
      .populate('userId')
      .populate('productId')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const order =
      await this.orderModel
        .findById(id)
        .populate('userId')
        .populate('productId');

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return order;
  }

  async findUserOrders(
    userId: string,
  ) {
    return this.orderModel
      .find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 });
  }

  async update(
    id: string,
    data: Partial<Order>,
  ) {
    const order =
      await this.orderModel.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
        },
      );

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return order;
  }

  async updateStatus(
    orderId: string,
    status: string,
  ) {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      {
        new: true,
      },
    );
  }

  async updateTrackingCode(
    orderId: string,
    trackingCode: string,
  ) {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      {
        trackingCode,
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string) {
    const order =
      await this.orderModel.findByIdAndDelete(
        id,
      );

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return {
      message:
        'Order deleted successfully',
    };
  }

  async getTotalSales() {
    const result =
      await this.orderModel.aggregate([
        {
          $match: {
            status: {
              $in: [
                'paid',
                'processing',
                'shipped',
                'delivered',
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: '$totalPrice',
            },
          },
        },
      ]);

    return result[0]?.totalSales || 0;
  }
}