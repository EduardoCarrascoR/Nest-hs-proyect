import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDv, UserData, UpdateUser } from '../interface/user.interface';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_REPOSITORY')
            private userRepository: Repository<User>,
            
        ){}

    
    async createUser(user: CreateUserDv) {
        let value = this.dgv(user.rut,user.rutDv)
        if (value===true) {
            const USER = await this.save(user)
            
            return await this.userRepository.insert(USER)
            .catch(err => {
                console.log(err)
            })
        } else {
            throw new ErrorEvent('user:create:missingRutValidation'); // REVISAR COMO HACER
        } 
    }

    async findAllUser(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOneUser(options: any): Promise<User> {
        return await this.userRepository.findOne(options);
    }

    async updateUser(id: number, newValue: Partial<UpdateUser>){
        return await this.userRepository.update({user_id: id}, newValue);
    }




    async updateUser(id: number, newValue: UpdateUserDTO){
        return await this.userRepository.update({userId: id}, newValue);
    }

    private dgv(rut: number, dv: string){  
        var M=0,S=1;
        for(;rut;rut=Math.floor(rut/10)){
        S=(S+rut%10*(9-M++%6))%11;}
        //return S?S-1:'k';
        S=S-1
        switch (S) {
          case 11:
              if(dv===(S.toString())){return true}else{return false}
              break;
          case 0:
              let s='K'
              if(dv===(s)){return true}else{return false}
              break;    
          default:
              if(dv===(S.toString())){return true}else{return false}
              break;
        }
   }
}
