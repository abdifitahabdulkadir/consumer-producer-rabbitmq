import { Global, Module } from '@nestjs/common';
import { EmailModule } from '.././email/email.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Global()
@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [EmailModule],
})
export class AuthModule {}
