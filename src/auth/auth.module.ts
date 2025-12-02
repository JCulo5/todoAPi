// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt'; // Importaj JwtModule
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      // Registriraj JwtModule
      secret: 'your_jwt_secret_key', // Tajni ključ za potpisivanje tokena
      signOptions: { expiresIn: '1h' }, // Opcionalno, postavi vrijeme isteka tokena
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
