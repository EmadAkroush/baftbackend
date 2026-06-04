import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    default: '',
  })
  description: string;

  // قیمت اصلی
  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  // قیمت با تخفیف
  @Prop({
    default: 0,
    min: 0,
  })
  discountPrice: number;

  // دسته بندی
  @Prop({
    required: true,
  })
  category: string;

  // نوع بافت
  @Prop({
    default: null,
  })
  knitType: string;

  // جنس
  @Prop({
    default: null,
  })
  material: string;

  // رنگ
  @Prop({
    type: [String],
    default: [],
  })
  colors: string[];

  // سایز
  @Prop({
    type: [String],
    default: [],
  })
  sizes: string[];

  // تصاویر
  @Prop({
    type: [String],
    default: [],
  })
  images: string[];

  // روش ارسال
  @Prop({
    default: 'post',
  })
  shippingMethod: string;

  // کد رهگیری
  @Prop({
    default: null,
  })
  trackingCode: string;

  // موجودی
  @Prop({
    default: 0,
  })
  stock: number;

  // امتیاز محصول
  @Prop({
    default: 0,
  })
  rating: number;

  // تعداد فروش
  @Prop({
    default: 0,
  })
  soldCount: number;

  // فعال / غیرفعال
  @Prop({
    default: true,
  })
  active: boolean;

  // محصول ویژه
  @Prop({
    default: false,
  })
  featured: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);