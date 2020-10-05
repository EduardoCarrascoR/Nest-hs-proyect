import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { localAuthGuard, JwtAuthGuard } from '../../guards';
import { User, Auth } from 'src/common/decorators';
import { User as UserEntity } from 'src/entities';
import { ApiTags } from '@nestjs/swagger';
import { loginDto } from '../dto';
import { AppResources } from 'src/common/enums';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService
    ){}

  @UseGuards(localAuthGuard)
  @Post('/login')
  async login(@Body() loginDto: loginDto, @User() user: UserEntity){
    const data =  await this.authService.login(user)
    return {
      message: 'Login sucess',
      data
    }
  }

  @Auth({
    possession: 'own',
    action: 'read',
    resource: AppResources.AUTH,
  })
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

