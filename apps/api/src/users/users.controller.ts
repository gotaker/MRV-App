import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.users.list(Number(page), Number(limit));
  }
}
