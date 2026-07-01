import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 🟠 Refresh JWT tokens
  @Get('refresh')
  async refresh(@Req() req: Request) {
    const authHeader = (req.headers['authorization'] ||
      req.headers['Authorization']) as string;
    return this.authService.refreshToken(authHeader);
  }

    // 🔴 Logout (requires valid JWT)

  @Post('logout')
  async logout(@Req() req: any) {
    return this.authService.logout(req.user);
  }

 

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
