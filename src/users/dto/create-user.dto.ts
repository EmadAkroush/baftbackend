// src/modules/users/dto/create-user.dto.ts

import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsArray,
} from 'class-validator';

import { UserLevel, UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsString()
  family!: string;

  @IsPhoneNumber('IR')
  phone!: string;

  @IsOptional()
  @IsEnum(UserLevel)
  level!: UserLevel;

  @IsOptional()
  @IsNumber()
  reward!: number;

  @IsString()
  referralCode!: string;

  @IsOptional()
  @IsString()
  referredBy!: string;

  @IsOptional()
  @IsString()
  zipcode!: string;

  @IsOptional()
  @IsString()
  province!: string;

  @IsOptional()
  @IsString()
  city!: string;

  @IsOptional()
  @IsBoolean()
  active!: boolean;

  @IsOptional()
  @IsArray()
  shaba!: string[];

  @IsOptional()
  @IsBoolean()
  authentication!: boolean;

  @IsOptional()
  @IsString()
  idCard!: string;

  @IsOptional()
  @IsNumber()
  orders!: number;

  @IsOptional()
  @IsNumber()
  leftHand!: number;

  @IsOptional()
  @IsNumber()
  rightHand!: number;

  @IsOptional()
  @IsNumber()
  teamOrders!: number;

  @IsOptional()
  @IsString()
  otp!: string;

  @IsOptional()
  @IsString()
  avatar!: string;

  @IsOptional()
  @IsNumber()
  mainBalance!: number;

  @IsOptional()
  @IsNumber()
  maxCapBalance!: number;

  @IsOptional()
  @IsNumber()
  withdrawalTotalBalance!: number;

  @IsOptional()
  @IsNumber()
  pairCycle!: number;

  @IsOptional()
  @IsNumber()
  maxCapBalanceWeek!: number;

  @IsOptional()
  @IsNumber()
  referralBalance!: number;

  @IsOptional()
  @IsNumber()
  bonusBalance!: number;

  @IsOptional()
  @IsNumber()
  totalIncome!: number;

  @IsOptional()
  @IsNumber()
  totalBalance!: number;

  @IsOptional()
  @IsString()
  refreshToken!: string;

  @IsOptional()
  @IsString()
  verificationToken!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role!: UserRole;
}