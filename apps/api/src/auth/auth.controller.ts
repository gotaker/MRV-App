import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from '../common/dto/login.dto';
import { RegisterDto } from '../common/dto/register.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.auth.register(body.email, body.password, body.name);
  }

  @Post('login')
  login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.auth.login(body.email, body.password, res);
  }

  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.['refresh_token'];
    return this.auth.refresh(token, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.auth.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return { id: req.user.userId, email: req.user.email, roles: req.user.roles };
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  whoami(@Req() req: any) {
    return { id: req.user.userId, email: req.user.email, roles: req.user.roles };
  }
}
