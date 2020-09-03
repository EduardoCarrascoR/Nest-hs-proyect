import { Injectable, forwardRef, Inject, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from '../../../entities/User.entity';
import { Repository } from 'typeorm';
import { UserDTO, CreateUserDTO } from '../dtos/user.DTO';
import { toUserDto } from 'src/shared/mapper';
import { EditUserDto } from '../dtos/edit-user.dto';
import { config } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
            private readonly userRepository: Repository<User>,
    ){}

    async addUser(userDTO: CreateUserDTO): Promise<UserDTO> {
        const { rutSD, rutDv, ...rest } = userDTO;
        let value = await this.dgv(rutSD,rutDv)
        
        if (value===true) {
            const rut = rutSD.toString().concat(rutDv.toString());
            const userInDb = await this.userRepository.findOne({ 
                where: { rut } 
            }); 
            if (userInDb) {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
            }
            const user: User = await this.userRepository.create({
                rut,
                ...rest           
            });

            await this.userRepository.save(user)

            return toUserDto(user);
        } else {
            throw new HttpException('Rut not valid', HttpStatus.BAD_REQUEST); // REVISAR COMO HACER
        } 
    }
    
    async findAllUser(): Promise<UserDTO[]> {
        return await this.userRepository.find();
    }

    async findOneUser(id: any) {
        const user = await this.userRepository.findOne(id);
        if (!user) throw new NotFoundException('User does not exists')

        return user;
    } 

    async findOneUserByEmail(email: string){
        return await this.userRepository
            .createQueryBuilder('user')
            .where({ email })
            .addSelect('user.password')
            .getOne()
    } 

    async updateUser(id: number, newValue: EditUserDto){
        return await this.userRepository.update({ id }, newValue);
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
