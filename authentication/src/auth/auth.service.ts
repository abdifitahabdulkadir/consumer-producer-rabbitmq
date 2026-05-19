import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { DatabseService } from '../../src/database/database.service.js';
import { ChangePasswordDTO, LoginDTO, SignUpDto } from './auth.dto.js';
@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabseService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(user: SignUpDto) {
    const { email, password, name } = user;

    const isEmialExisted = await this.db.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmialExisted) {
      throw new BadRequestException('This email is already used.');
    }

    // salt, is number of rounds for algorithm to hash the password.
    // and if two users use same password
    // then it will produce different passwords.
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return {
      message: 'User has been created successfully',
      name,
    };
  }

  async login(user: LoginDTO) {
    const { password, email } = user;
    const userExisted = await this.db.user.findUnique({
      where: {
        email,
      },
      select: {
        password: true,
        email: true,
        id: true,
      },
    });
    if (!userExisted) {
      throw new UnauthorizedException('Invalid password or email.');
    }

    const isSamePassword = await bcrypt.compare(password, userExisted.password);
    if (!isSamePassword) {
      throw new UnauthorizedException('Invalid password or email.');
    }

    // generate jwt token for user
    const accessToken = this.generateJWTToken({
      userId: userExisted.id,
    });

    return {
      message: 'successfully logged In.',
      status: 200,
      accessToken,
    };
  }
  async getAllUsers() {
    return (await this.db.user.findMany()).map(
      ({ createdAt, updatedAt, ...rest }) => ({
        ...rest,
        createdAt: createdAt.toLocaleDateString('en-Us', {
          month: 'long',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        updatedAt: updatedAt.toLocaleDateString('en-Us', {
          month: 'long',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }),
    );
  }

  generateJWTToken({ userId }: { userId: string }) {
    const accessToken = this.jwt.sign(
      { userId },
      {
        // short lived and will be used "refersh token"
        // to generate a new access token.
        expiresIn: '1h',
        secret: process.env.JWT_SERCRET_KEY,
      },
    );
    return accessToken;
  }

  async generateRefereshToken(userId: string) {
    const newRefereshToken = uuid();
    const now = new Date();
    await this.db.refershToken.create({
      data: {
        userId,
        token: newRefereshToken,

        // added 3 days to current date.
        expirationDate: new Date(now.getDate() + 3),
      },
    });
    return {
      refeshToken: newRefereshToken,
    };
  }

  async changeUserPassword({
    userId,
    OldPassword,
    newPassword,
  }: ChangePasswordDTO & {
    userId: string;
  }) {
    const userExisted = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userExisted) {
      throw new BadRequestException('User Not found');
    }
    const same = await bcrypt.compare(OldPassword, userExisted.password);

    if (!same) {
      throw new UnauthorizedException('Both Passwords should match.');
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashNewPassword,
      },
    });

    return {
      message: 'successfully changed your passwrod. please login',
    };
  }
}
