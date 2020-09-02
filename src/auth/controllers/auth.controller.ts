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
  async login(@Req() req: any){
    return req.user
  }

    /* console.log('Login attempt, user:', email);

    const user = await this.userRepository.findOne({ email });

    if (!user){
      console.log('User does not exist on the database');
      
      throw new UnauthorizedException();
    }

    return new Promise((resolve, reject) => {
      password(plainTextPassword).verifyAgainst(
        user.password,
        (err, verified) => {
          if (!verified) {
            reject(new UnauthorizedException());
          }else {
            console.log('Login success!');
          }

          const authJwtToken = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET);

          resolve({ token: authJwtToken });
        }
      )

    }); */



}

