import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { localStrategy } from './strategies';

@Module({
  imports: [ PassportModule, UsersModule ],
  providers: [AuthService, localStrategy],
  controllers: [AuthController],
})

export class AuthModule {}
