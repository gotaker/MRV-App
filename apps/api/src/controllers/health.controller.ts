import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/healthz')
  healthz() {
    return { status: 'ok' };
  }

  @Get('/readyz')
  readyz() {
    return { status: 'ready' };
  }
}
