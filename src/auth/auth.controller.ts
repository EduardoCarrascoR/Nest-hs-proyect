import { Controller, UnauthorizedException, Post, Body, Inject, forwardRef } from '@nestjs/common';
import { User } from 'src/modules/users/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as password from 'password-hash-and-salt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/modules/users/services/users.service';

dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
      private userRepository: Repository<User>
    ){}

  @Post()
  async login(@Body('email')email: string, @Body('password')plainTextPassword: string){
    console.log('Login attempt, user:', email);

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

    });


  }
}
