import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('send-otp')
  sendOtp(@Body() body: { phone: string }) {
    return this.authService.sendOtp(body.phone);
  }
  @Post('verify-otp')
  verifyOtp(
    @Body()
    body: {
      phone: string;
      code: string;
    },
  ) {
    return this.authService.verifyOtp(body.phone, body.code);
  }
  
}
