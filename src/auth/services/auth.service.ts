import { Injectable, forwardRef, Inject, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/entities';
import { UsersService } from 'src/modules/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ){}
  

  async validateUser(rut: string, pass: string): Promise<any> {
    const rutform = await this.rutFormat(rut)
    const user = await this.userService.findOneUserByRut(rutform);

    if(user && bcrypt.compare(pass, user.password)){
      const { password, ...rest } = user
      return rest;
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

  private rutFormat(rut: string) {
    var valor = rut.replace('.','').replace('.','').replace('-','');

    return valor
}
}