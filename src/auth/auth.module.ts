import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../modules/users/users.module';
import { localStrategy, JwtStrategy } from './strategies';
import { JWT_SECRET } from "../config/constants";

@Module({
  imports: [ PassportModule, 
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(JWT_SECRET),
        signOptions: { expiresIn: '60m'}
      })
    }),
     UsersModule ],
  providers: [AuthService, localStrategy, JwtStrategy],
  controllers: [AuthController],
})

export class AuthModule {}
