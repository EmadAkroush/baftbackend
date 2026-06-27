import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtService } from '@nestjs/jwt';

import { User } from '../users/schemas/user.schema';
import { Otp } from './schemas/otp.schema';

const MelipayamakApi = require('melipayamak-api');

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
    const code = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // حذف کدهای قبلی
    await this.otpModel.deleteMany({
      phone,
    });

    await this.otpModel.create({
      phone,
      code,
      expiresAt: new Date(
        Date.now() + 2 * 60 * 1000,
      ),
    });

    const api = new MelipayamakApi(
      process.env.SMS_USERNAME,
      process.env.SMS_PASSWORD,
    );

    const sms = api.sms();

    await sms.send(
      phone,
      process.env.SMS_FROM,
      `کد ورود شما: ${code}`,
    );

    return {
      success: true,
      message: 'کد تایید ارسال شد.',
    };
  }

  // ===========================
  // تایید کد
  // ===========================

  async verifyOtp(
    phone: string,
    code: string,
  ) {
    const otp =
      await this.otpModel.findOne({
        phone,
        code,
      });

    if (!otp) {
      throw new BadRequestException(
        'کد وارد شده صحیح نیست.',
      );
    }

    if (
      otp.expiresAt.getTime() <
      Date.now()
    ) {
      throw new BadRequestException(
        'کد منقضی شده است.',
      );
    }

    let user =
      await this.userModel.findOne({
        phone,
      });

    if (!user) {
      user =
        await this.userModel.create({
          phone,
        });
    }

    await this.otpModel.deleteMany({
      phone,
    });

    const token =
      this.jwtService.sign({
        id: user._id,
        phone: user.phone,
      });

    return {
      token,
      user,
    };
  }

  // ===========================
  // گرفتن اطلاعات کاربر
  // ===========================

  async getProfile(id: string) {
    return this.userModel.findById(id);
  }
}