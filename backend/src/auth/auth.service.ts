import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  [key: string]: unknown;
}

@Injectable()
export class AuthService {
  private otps = new Map<string, { code: string; expiresAt: number }>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<AuthUser | null> {
    // FALLBACK ADMIN for MVP
    if (username === 'admin' && pass === 'admin') {
      return {
        id: 'admin-id',
        email: 'admin@beyondtee.com',
        role: 'ADMIN',
        name: 'Admin User',
      };
    }

    // Real DB Check
    const user = await this.usersService.findByEmail(username);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as unknown as AuthUser;
    }
    return null;
  }

  login(user: AuthUser) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }

  async sendOtp(phoneNumber: string): Promise<boolean> {
    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store with 5 min expiry
    this.otps.set(phoneNumber, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // In production, integrate Twilio/SNS here
    console.log(`[MOCK SMS] Sending OTP ${code} to mobile: ${phoneNumber}`);
    return true;
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
    const record = this.otps.get(phoneNumber);
    if (!record) return false;

    if (Date.now() > record.expiresAt) {
      this.otps.delete(phoneNumber);
      return false; // Expired
    }

    if (record.code === code) {
      this.otps.delete(phoneNumber);
      return true;
    }

    return false;
  }
}
