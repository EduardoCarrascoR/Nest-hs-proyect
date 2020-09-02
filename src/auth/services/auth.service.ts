import { Injectable, forwardRef, Inject, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService
  ){}
  

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneUserByEmail(email);

    if(user && bcrypt.compare(pass, user.password)){
      return user;
    }

    return null
  }

  login(credentials: any) {
    
  }
  /*
    Implementation that makes use of this.usersService
  */
}