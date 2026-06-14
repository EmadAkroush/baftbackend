import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({
    default: null,
  })
  slug: string;

  @Prop({
    default: null,
  })
  description: string;

  @Prop({
    default: null,
  })
  image: string;

  @Prop({
    default: true,
  })
  active: boolean;

  @Prop({
    default: 0,
  })
  sortOrder: number;

  @Prop({
    default: null,
  })
  parentId: string;
}

export const CategorySchema =
  SchemaFactory.createForClass(Category);