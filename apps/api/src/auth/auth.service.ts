import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  private signAccessToken(payload: any) {
    const secret = process.env.API_JWT_SECRET || 'dev-secret';
    const expiresIn = process.env.API_JWT_EXPIRES || '15m';
    return this.jwt.signAsync(payload, { secret, expiresIn });
  }

  private signRefreshToken(payload: any) {
    const secret = process.env.API_REFRESH_SECRET || 'dev-refresh-secret';
    const expiresIn = process.env.API_REFRESH_EXPIRES || '7d';
    return this.jwt.signAsync(payload, { secret, expiresIn });
  }

  private cookieOptions() {
    const secure = (process.env.COOKIE_SECURE || 'false') === 'true';
    return {
      httpOnly: true,
      secure,
      sameSite: 'lax' as const,
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
  }

  async register(email: string, password: string, name?: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already exists');
    const user = await this.users.createUser(email, password, name, ['admin']);
    return { id: user.id, email: user.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.active) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string, res: any) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken({ sub: user.id });
    res.cookie('refresh_token', refreshToken, this.cookieOptions());
    return { accessToken };
  }

  async refresh(refreshToken: string, res: any) {
    const secret = process.env.API_REFRESH_SECRET || 'dev-refresh-secret';
    try {
      const decoded = await this.jwt.verifyAsync(refreshToken, { secret });
      const user = await this.users.findById(decoded.sub);
      if (!user || !user.active) throw new UnauthorizedException();
      const accessToken = await this.signAccessToken({ sub: user.id, email: user.email, roles: user.roles });
      res.cookie('refresh_token', await this.signRefreshToken({ sub: user.id }), this.cookieOptions());
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: any) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { ok: true };
  }
}
