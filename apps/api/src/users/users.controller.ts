import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Param() _params) {
    // Placeholder; real impl in AuthController.me using request.user
    return { message: 'Use /auth/me instead.' };
  }

  @Get()
  async list() {
    return this.usersService.list();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { ok: true };
  }
}
