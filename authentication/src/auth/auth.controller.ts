import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import z from 'zod';
import { AuthGuard } from '../../src/guards/guards.guard.js';
import { ZodValidationPipe } from '../../src/pipes/validation.pipe.js';
import {
  type ChangePasswordDTO,
  ChangePasswordSchema,
  type LoginDTO,
  LoginSchema,
  type SendResetDTO,
  SendResetPasswordSchema,
  type SignUpDto,
  SignUpSchema,
} from './auth.dto.js';
import { AuthService } from './auth.service.js';
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('signup')
  async signUP(@Body(new ZodValidationPipe(SignUpSchema)) user: SignUpDto) {
    return await this.authService.signUp(user);
  }

  @Post('login')
  async login(@Body(new ZodValidationPipe(LoginSchema)) user: LoginDTO) {
    return await this.authService.login(user);
  }

  @Get('users')
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }

  @Post('reset')
  async resetPassword(
    @Body(new ZodValidationPipe(SendResetPasswordSchema)) data: SendResetDTO,
  ) {
    return await this.authService.sendResetLink(data);
  }

  @Put('reset-password')
  async resetNewpasswrod(
    @Body(
      new ZodValidationPipe(
        ChangePasswordSchema.omit({
          OldPassword: true,
        }),
      ),
    )
    data: Omit<ChangePasswordDTO, 'OldPassword'>,
    @Query('token') token: string,
  ) {
    return await this.authService.setNewPasswrod({
      ...data,
      token,
    });
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body(
      new ZodValidationPipe(
        ChangePasswordSchema.extend({
          userId: z.string().min(1, 'UserId is required'),
        }),
      ),
    )
    data: ChangePasswordDTO & {
      userId: string;
    },
  ) {
    return this.authService.changeUserPassword({
      ...data,
      userId: data.userId,
    });
  }
}
