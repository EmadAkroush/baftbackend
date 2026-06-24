import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  soldCount?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discountPrice?: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  knitType?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  colors?: string;

  @IsOptional()
  @IsString()
  sizes?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @IsOptional()
  @IsString()
  trackingCode?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stock?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;
}