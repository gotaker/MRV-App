import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  signAccess(user: any) {
    const payload = { sub: user._id.toString(), email: user.email, roles: user.roles || [] };
    const secret = process.env.API_JWT_SECRET || 'dev-secret';
    const expiresIn = process.env.API_JWT_EXPIRES || '15m';
    return this.jwt.sign(payload, { secret, expiresIn });
  }

  signRefresh(user: any) {
    const payload = { sub: user._id.toString(), typ: 'refresh' };
    const secret = process.env.API_REFRESH_SECRET || 'dev-refresh';
    const expiresIn = process.env.API_REFRESH_EXPIRES || '7d';
    return this.jwt.sign(payload, { secret, expiresIn });
  }

  verifyRefresh(token: string) {
    const secret = process.env.API_REFRESH_SECRET || 'dev-refresh';
    return this.jwt.verify(token, { secret });
  }
}
