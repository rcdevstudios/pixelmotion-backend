import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthForgotPasswordService } from './auth-forgot-password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthForgotPasswordController {
  constructor(
    private readonly authForgotPasswordService: AuthForgotPasswordService,
  ) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body(new ValidationPipe()) dto: ForgotPasswordDto) {
    return this.authForgotPasswordService.sendOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body(new ValidationPipe()) dto: VerifyOtpDto) {
    return this.authForgotPasswordService.verifyOtp(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body(new ValidationPipe()) dto: ResetPasswordDto) {
    return this.authForgotPasswordService.resetPassword(dto);
  }
}
