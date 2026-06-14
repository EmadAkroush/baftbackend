import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(data: any) {
    const category =
      new this.categoryModel(data);

    return category.save();
  }

  async findAll() {
    return this.categoryModel
      .find()
      .sort({ sortOrder: 1 })
      .lean();
  }

  async findActive() {
    return this.categoryModel
      .find({
        active: true,
      })
      .sort({ sortOrder: 1 })
      .lean();
  }

  async findById(id: string) {
    const category =
      await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return category;
  }

  async update(
    id: string,
    data: any,
  ) {
    const category =
      await this.categoryModel.findByIdAndUpdate(
        id,
        data,
        { new: true },
      );

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return category;
  }

  async delete(id: string) {
    return this.categoryModel.findByIdAndDelete(
      id,
    );
  }
}