import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { localAuthGuard, JwtAuthGuard } from '../../guards';
import { User, Auth } from '../../common/decorators';
import { AppResources } from '../../common/enums';
import { User as UserEntity } from '../../entities';
import { loginDto } from '../dto';

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

