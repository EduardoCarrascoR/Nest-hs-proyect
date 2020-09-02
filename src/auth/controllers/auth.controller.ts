import { Controller, UnauthorizedException, Post, Body, Inject, forwardRef, UseGuards, Req } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as password from 'password-hash-and-salt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { localStrategy } from '../strategies';
import { localAuthGuard } from 'src/guards/local-auth.guard';
import { User } from 'src/common/decorators';
import { User as UserEntity} from 'src/entities';

dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(
      private authService: AuthService
    ){}

  @Post('/register')
  async register(@Body() credentials) {
    return ""
  } 

  @UseGuards(localAuthGuard)
  @Post('/login')
  async login(@User() user: UserEntity){
    return user
  }

}

