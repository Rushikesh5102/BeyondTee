import { Body, Controller, Post, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const user = await this.authService.validateUser(signInDto.username, signInDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user); // Returns user object + token
  }
}
