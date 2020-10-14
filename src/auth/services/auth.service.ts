import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { UsersService } from '../../modules/users/services/users.service';
import { User } from '../../entities';
import { authenticate } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ){}
  

  async validateUser(rut: string, pass: string): Promise<any> {
    const user = await this.userService.findOneUserByRut(rut);

    if(user && bcrypt.compare(pass, user.password)){
      const { password, roles, ...rest } = user
      if(roles.includes('Admin')) return rest;
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

}