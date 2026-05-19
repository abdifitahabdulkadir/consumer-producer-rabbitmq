import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import z from 'zod';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SERCRET_KEY,
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate(config) {
        return z
          .object({
            JWT_SERCRET_KEY: z.string().min(1, 'JWT_SERCRET_KEY is required'),
            DATABASE_URL: z.string().min(1, 'Database Url is required'),
          })
          .parse(config);
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
