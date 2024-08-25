// auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Charge les variables d'environnement
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importe ConfigModule pour utiliser ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Récupère la clé secrète JWT depuis les variables d'environnement
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') }, // Récupère le temps d'expiration du token depuis les variables d'environnement
      }),
      inject: [ConfigService], // Injecte ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}