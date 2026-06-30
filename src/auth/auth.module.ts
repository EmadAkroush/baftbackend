import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import {
  User,
  UserSchema,
} from '../users/schemas/user.schema';

import {
  Otp,
  OtpSchema,
} from './schemas/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Otp.name,
        schema: OtpSchema,
      },
    ]),

    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'JWT_SECRET',
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService],

  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}