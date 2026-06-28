import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtService } from '@nestjs/jwt';

import { User } from '../users/schemas/user.schema';
import { Otp } from './schemas/otp.schema';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Otp.name)
    private readonly otpModel: Model<Otp>,

    private readonly jwtService: JwtService,
  ) {}

  // ===========================
  // ارسال کد تایید
  // ===========================

  async sendOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // حذف کدهای قبلی
    await this.otpModel.deleteMany({
      phone,
    });

    await this.otpModel.create({
      phone,
      code,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    try {
      await axios.post('https://rest.payamak-panel.com/api/SendSMS/SendSMS', {
        username: process.env.SMS_USERNAME,
        password: process.env.SMS_PASSWORD,
        to: phone,
        from: process.env.SMS_FROM,
        text: `کد ورود شما: ${code}`,
        isflash: false,
      });

      return {
        success: true,
        message: 'کد تایید ارسال شد.',
      };
    } catch (error) {
      console.log(error);

      throw new BadRequestException('خطا در ارسال پیامک');
    }
  }

  // ===========================
  // تایید کد
  // ===========================

  async verifyOtp(phone: string, code: string) {
    const otp = await this.otpModel.findOne({
      phone,
      code,
    });

    if (!otp) {
      throw new BadRequestException('کد وارد شده صحیح نیست.');
    }

    if (otp.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('کد منقضی شده است.');
    }

    // پیدا کردن کاربر
    let user = await this.userModel.findOne({
      phone,
    });

    // آیا کاربر جدید است؟
    let isNewUser = false;

    if (!user) {
      isNewUser = true;

      user = await this.userModel.create({
        phone,
      });
    }

    // حذف OTP های استفاده شده
    await this.otpModel.deleteMany({
      phone,
    });

    // ساخت توکن
    const token = this.jwtService.sign({
      id: user._id,
      phone: user.phone,
    });

    return {
      success: true,
      message: 'ورود با موفقیت انجام شد.',
      token,
      isNewUser,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name || null,
        family: user.family || null,
      },
    };
  }

  // ===========================
  // گرفتن اطلاعات کاربر
  // ===========================

  async getProfile(id: string) {
    return this.userModel.findById(id);
  }
}
