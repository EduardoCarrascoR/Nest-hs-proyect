import { Controller, Post, Body, UseGuards, Get, Res, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { localAuthGuard, JwtAuthGuard } from '../../guards';
import { User, Auth } from '../../common/decorators';
import { AppResources } from '../../common/enums';
import { User as UserEntity } from '../../entities';
import { loginDto } from '../dto';
import { guardAuthGuard } from 'src/guards/guard-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService
    ){}

  @UseGuards(localAuthGuard)
  @Post('/login')
  async loginWeb(@Body() loginDto: loginDto, @User() user: UserEntity, @Res() res){
    const data =  await this.authService.login(user)
    return res.status(HttpStatus.ACCEPTED).json({ success: true, message: 'Login success', data })
  }

  @UseGuards(guardAuthGuard)
  @Post('/loginApp')
  async loginApp(@Body() loginDto: loginDto, @User() user: UserEntity, @Res() res){
    const data =  await this.authService.loginGuard(user)
    return res.status(HttpStatus.ACCEPTED).json({ success: true, message: 'Login success', data })
  }

  @Auth({
    possession: 'own',
    action: 'read',
    resource: AppResources.AUTH,
  })
  @Get('profile')
  profile(@User() user: UserEntity, @Res() res){
    return res.status(HttpStatus.OK).json({ success: true, message: 'Peticion correcta', user })
  }

  @Auth()
  @Get('/refresh')
  async refreshToken(@User() user: UserEntity, @Res() res){
    const data =  await this.authService.login(user)
    return res.status(HttpStatus.ACCEPTED).json({ success: true, message: 'Fefresh sucess', data })
  }



}

