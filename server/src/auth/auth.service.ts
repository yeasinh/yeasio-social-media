import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterInput, LoginInput } from './dto/auth.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (userExists) {
      throw new Error('Email already registered');
    }

    const hashed = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashed,
      },
    });

    const token = this.jwt.sign({ userId: user.id, email: user.email });

    return {
      token,
      name: user.name,
      email: user.email,
    };
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ userId: user.id, email: user.email });

    return {
      token,
      name: user.name,
      email: user.email,
    };
  }
}
