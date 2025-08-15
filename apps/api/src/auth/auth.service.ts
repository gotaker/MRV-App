import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  private signAccess(payload: any) {
    return this.jwt.signAsync(payload, {
      secret: process.env.API_JWT_SECRET || 'dev-secret',
      expiresIn: process.env.API_JWT_EXPIRES || '15m',
    });
  }

  private signRefresh(payload: any) {
    return this.jwt.signAsync(payload, {
      secret: process.env.API_REFRESH_SECRET || 'dev-refresh',
      expiresIn: process.env.API_REFRESH_EXPIRES || '7d',
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.active) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id.toString(), email: user.email, roles: user.roles };
    const accessToken = await this.signAccess(payload);
    const refreshToken = await this.signRefresh({ sub: payload.sub });
    return { accessToken, refreshToken };
  }
}
