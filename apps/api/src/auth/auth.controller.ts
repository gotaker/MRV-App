import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../common/dto/login.dto';
import { RegisterDto } from '../common/dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.createUser(dto.email, dto.name, hash, dto.roles);
    return { id: user._id, email: user.email };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const accessToken = this.auth.signAccess(user);
    const refreshToken = this.auth.signRefresh(user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });
    return { accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req) {
    const token = req.cookies?.refresh_token;
    if (!token) return { accessToken: null };
    const payload = this.auth.verifyRefresh(token);
    const user = { _id: payload.sub, email: '', roles: [] };
    const accessToken = this.auth.signAccess(user);
    return { accessToken };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { ok: true };
  }

  @Get('me')
  async me(@Req() req) {
    // For dev simplicity, return minimal info if Authorization exists; later protect with guard
    const auth = req.headers['authorization'] || '';
    if (!auth.startsWith('Bearer ')) return null;
    // token payload decode optional; keeping simple
    return { email: 'dev@user', id: 'me' };
  }
}
