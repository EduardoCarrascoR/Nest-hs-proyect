import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { UsersService } from '../../modules/users/services/users.service';
import { User } from '../../entities';
import { AppRoles } from 'src/common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ){}
  

  async validateUserAdmin(rut: string, pass: string): Promise<any> {
    const user = await this.userService.findOneUserByRut(rut);

    if(user && bcrypt.compare(pass, user.password)){
      const { password, roles, ...rest } = user
      if(roles.includes(AppRoles.Admin)) return rest;
      else throw new HttpException({ success: false, status: HttpStatus.UNAUTHORIZED, message: "User doesn't authorized"},HttpStatus.UNAUTHORIZED);
      
    }

    return null
  }

  async validateUserGuard(rut: string, pass: string): Promise<any> {
    const user = await this.userService.findOneUserByRut(rut);

    if(user && bcrypt.compare(pass, user.password)){
      const { password, roles, ...rest } = user
      if(roles.includes(AppRoles.Guard)) return rest;
      else throw new HttpException({ success: false, status: HttpStatus.UNAUTHORIZED, message: "User doesn't authorized"},HttpStatus.UNAUTHORIZED);
      
    }

    return null
  }

  async login(user: User) {
    const { id, ...rest } = user;
    const payload = { sub: id };

    return {
      ...rest,
      accessToken: this.jwtService.sign(payload)

    }
  }

  async loginGuard(user: User) {
    const { id, ...rest } = user;
    const payload = { sub: id };

    return {
      ...rest,
      accessToken: this.jwtService.sign(payload,{ expiresIn: '1h' })

    }
  }

}