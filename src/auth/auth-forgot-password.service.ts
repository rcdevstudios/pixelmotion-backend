import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthForgotPasswordService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async sendOtp(dto: ForgotPasswordDto) {
    return this.supabaseService.sendOtp(dto.email.toLowerCase());
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const data = await this.supabaseService.verifyOtp(
      dto.email.toLowerCase(),
      dto.otp,
    );

    if (!data.session) {
      throw new UnauthorizedException('OTP verification failed');
    }

    return {
      message: 'OTP verified successfully',
      session: data.session,
      user: data.user,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const result = await this.supabaseService.updatePassword(dto.password);
    return {
      message: 'Password updated successfully',
      user: result.user,
    };
  }
}
