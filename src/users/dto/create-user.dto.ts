// src/modules/users/dto/create-user.dto.ts

import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name?: string;

  @IsString()
  family?: string;

  @IsPhoneNumber('IR')
  phone?: string;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;

  @IsOptional()
  @IsString()
  referredBy?: string;

  @IsOptional()
  @IsString()
  nationalCode?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zipcode?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  idCard?: string;

  @IsOptional()
  shaba?: string[];
}