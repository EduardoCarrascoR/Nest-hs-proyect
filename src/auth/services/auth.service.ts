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
  

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneUserByEmail(email);

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
      accessToken: this.jwtService.sign(payload)

    }
  }
}