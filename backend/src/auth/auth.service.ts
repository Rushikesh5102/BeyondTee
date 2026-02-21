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
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
}
