import { Controller, UnauthorizedException, Post, Body, Inject, forwardRef, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { localAuthGuard, JwtAuthGuard } from '../../guards';
import { User, Auth } from 'src/common/decorators';
import { User as UserEntity } from 'src/entities';
import { get } from 'http';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService
    ){}

  @Post('/register')
  async register(@Body() credentials) {
    return ""
  } 

  @UseGuards(localAuthGuard)
  @Post('/login')
  async login(@User() user: UserEntity){
    const data =  await this.authService.login(user)
    return {
      message: 'Login sucess',
      data
    }
  }

  @Auth()
  @Get('profile')
  profile(@User() user: UserEntity){
    return {
      message: 'Peticion correcta',
      user
    }
  }

  @Auth()
  @Get('/refresh')
  async refreshToken(@User() user: UserEntity){
    const data =  await this.authService.login(user)
    return {
      message: 'Fefresh sucess',
      data
    }
  }



}

