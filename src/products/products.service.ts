import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { File } from 'multer';

import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async create(data: Partial<Product>, files: File[]) {
    const images = files.map((file) => `/uploads/products/${file.filename}`);

    const product = new this.productModel({
      ...data,
      images,
    });

    return product.save();
  }

  async findAll(page = 1, limit = 9) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),

      this.productModel.countDocuments(),
    ]);

    return {
      data: products,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, data: Partial<Product>, files?: File[]) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // اگر عکس جدید ارسال شده
    if (files && files.length > 0) {
      data.images = files.map((file) => `/uploads/products/${file.filename}`);
    }

    Object.assign(product, data);

    return product.save();
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      message: 'Product deleted successfully',
    };
  }

  async findByCategory(category: string) {
    return this.productModel.find({
      category,
      active: true,
    });
  }

  async getFeaturedProducts() {
    return this.productModel.find({
      featured: true,
      active: true,
    });
  }
}
