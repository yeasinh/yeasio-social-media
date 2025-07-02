import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
