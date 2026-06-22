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

  @Prop({
    default: null,
  })
  brand: string;

  // رنگ
  @Prop({
    default: null,
  })
  colors: string;

  // سایز
  @Prop({
    default: null,
  })
  sizes: string;

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

  @Prop({
    default: null,
  })
  code: string;

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

  @Prop({
    type: String,
    required: true,
  })
  categoryId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
