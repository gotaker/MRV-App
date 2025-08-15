import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../common/dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private users: UsersService,
    private jwt: JwtService
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await this.users.create({
      email: body.email,
      name: body.name,
      passwordHash,
      roles: ['admin'],
      active: true,
    });
    return { id: user._id, email: user.email };
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) throw new Error('Invalid credentials');
    const { accessToken, refreshToken } = await this.auth.login(user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 3600 * 1000,
      path: '/auth/refresh',
    });
    return { accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const token = req.cookies?.['refresh_token'];
    if (!token) throw new Error('No refresh token');
    const payload = await this.jwt.verifyAsync(token, {
      secret: process.env.API_REFRESH_SECRET || 'dev-refresh',
    });
    const accessToken = await this.jwt.signAsync(
      { sub: payload.sub },
      { secret: process.env.API_JWT_SECRET || 'dev-secret', expiresIn: process.env.API_JWT_EXPIRES || '15m' },
    );
    return { accessToken };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return req.user;
  }
}
