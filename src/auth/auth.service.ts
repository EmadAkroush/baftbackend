import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import { JwtService } from '@nestjs/jwt';

import { User } from '../users/schemas/user.schema';
import { Otp } from './schemas/otp.schema';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<HydratedDocument<User>>,

    @InjectModel(Otp.name)
    private readonly otpModel: Model<HydratedDocument<Otp>>,

    private readonly jwtService: JwtService,
  ) {}

  // ===========================
  // ارسال کد تایید
  // ===========================

  private async generateTokens(user: HydratedDocument<User>) {
    const payload = {
      id: user._id,
      phone: user.phone,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async sendOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('==========================');
    console.log('شروع ارسال OTP');
    console.log('Phone:', phone);
    console.log('Code:', code);

    await this.otpModel.deleteMany({
      phone,
    });

    await this.otpModel.create({
      phone,
      code,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    try {
      const response = await axios.post(
        'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber',
        {
          username: process.env.SMS_USERNAME,
          password: process.env.SMS_PASSWORD,

          text: code,

          to: phone,

          bodyId: process.env.SMS_PATTERN_ID,
        },
      );

      console.log('========= RESPONSE =========');

      console.log(response.data);

      console.log('============================');

      // Check for errors in response
      if (response.data?.Value < 0 || response.data?.RetStatus !== 1) {
        console.log('SMS API returned error status');
        throw new BadRequestException(
          `خطا در ارسال پیامک: ${response.data?.StrRetStatus || response.data?.Value}`,
        );
      }

      return {
        success: true,
        message: 'کد تایید ارسال شد.',
      };
    } catch (error: any) {
      console.log('========== SMS ERROR ==========');

      console.log('Error Response:', error.response?.data);
      console.log('Error Message:', error.message);
      console.log('Error Status:', error.response?.status);
      console.log('Full Error:', error);

      console.log('===============================');

      throw new BadRequestException(
        error.response?.data?.StrRetStatus ||
          error.response?.data?.Value ||
          error.response?.data?.RetStatus ||
          error.message ||
          'خطا در ارسال پیامک',
      );
    }
  }

    // === Logout ===
  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
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
    const tokens = await this.generateTokens(user);

    return {
      success: true,
      message: 'ورود با موفقیت انجام شد.',
      isNewUser,

      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,

      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        family: user.family,
        referralCode: user.referralCode,
        role: user.role
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userModel.findById(payload.id);

      if (!user) {
        throw new BadRequestException('کاربر یافت نشد');
      }

      const tokens = await this.generateTokens(user);

      return {
        success: true,

        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,

        user,
      };
    } catch {
      throw new BadRequestException('Refresh Token نامعتبر است');
    }
  }

  // ===========================
  // گرفتن اطلاعات کاربر
  // ===========================

  async getProfile(id: string) {
    return this.userModel.findById(id);
  }
}
