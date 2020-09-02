import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { localStrategy, JwtStrategy } from './strategies';
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from "../config/constants";

@Module({
  imports: [ PassportModule, 
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(JWT_SECRET),
        signOptions: { expiresIn: '15m'}
      })
    }),
     UsersModule ],
  providers: [AuthService, localStrategy, JwtStrategy],
  controllers: [AuthController],
})

export class AuthModule {}
