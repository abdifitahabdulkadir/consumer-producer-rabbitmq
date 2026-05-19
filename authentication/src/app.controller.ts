import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { AuthGuard } from './guards/guards.guard.js';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
