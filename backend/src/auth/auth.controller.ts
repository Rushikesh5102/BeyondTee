import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, string>) {
    const user = await this.authService.validateUser(
      signInDto.username,
      signInDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user); // Returns user object + token
  }

  @Post('send-otp')
  async sendOtp(@Body('phoneNumber') phoneNumber: string) {
    if (!phoneNumber) throw new BadRequestException('Phone number required');
    await this.authService.sendOtp(phoneNumber);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { phoneNumber: string; code: string }) {
    if (!body.phoneNumber || !body.code) {
      throw new BadRequestException('Phone number and code required');
    }
    const isValid = await this.authService.verifyOtp(body.phoneNumber, body.code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    return { message: 'OTP verified successfully', valid: true };
  }
}
