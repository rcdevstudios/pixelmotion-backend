import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || user.passwordHash !== this.hashPassword(dto.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name ?? user.email.split('@')[0],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: payload.name,
      },
    };
  }

  async register(email: string, password: string, name?: string) {
    const normalizedEmail = email.toLowerCase();
    const finalName = (name ?? normalizedEmail.split('@')[0]).trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        name: finalName,
        passwordHash,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name ?? finalName,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: payload.name,
      },
    };
  }

  async logout() {
    try {
      const { error } = await this.supabaseService.client.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: 'User logged out successfully',
      };
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Logout failed',
      );
    }
  }
}
