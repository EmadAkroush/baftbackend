// src/modules/users/entities/user.entity.ts

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserLevel {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  LEADER = 'LEADER',
}

export class User {
  id!: string;

  name!: string;

  family!: string;

  phone!: string;

  level!: UserLevel;

  reward!: number;

  referralCode!: string;

  referredBy!: string;

  zipcode!: string;

  province!: string;

  city!: string;

  active!: boolean;

  shaba!: string[];

  authentication!: boolean;

  idCard!: string;

  orders!: number;

  leftHand!: number;

  rightHand!    : number;

  teamOrders!: number;

  otp!: string;

  avatar!: string;

  mainBalance!: number;

  maxCapBalance!: number;

  withdrawalTotalBalance!: number;

  pairCycle!: number;

  maxCapBalanceWeek!: number;

  referralBalance!: number;

  bonusBalance!: number;

  totalIncome!: number;

  totalBalance!: number;

  refreshToken!: string;

  verificationToken!: string;

  role!: UserRole;

  lastLogin!: Date;

  createdAt!: Date;

  updatedAt!: Date;
}