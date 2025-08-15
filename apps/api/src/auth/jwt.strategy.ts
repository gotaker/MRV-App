import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.API_JWT_SECRET || 'dev-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.users.findById(payload.sub);
    if (!user) return null;
    return { id: user._id.toString(), email: user.email, roles: user.roles };
  }
}
