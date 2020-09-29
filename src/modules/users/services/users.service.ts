import { Injectable, forwardRef, Inject, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from '../../../entities';
import { Repository } from 'typeorm';
import { UserDTO, CreateUserDTO } from '../dtos/user.DTO';
import { EditUserDto } from '../dtos/edit-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
            private readonly userRepository: Repository<User>,
    ){}

    async addUser(userDTO: CreateUserDTO): Promise<UserDTO> {
        const { rut, ...rest } = userDTO;
        const rutform = await this.rutFormat(rut)
        let value = await this.dgv(rutform.cuerpo,rutform.dv)
        
        if (value===true) {
            const rut = rutform.cuerpo.toString().concat(rutform.dv.toString());
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
            const { password, ...rest2 } = user
            return rest2;
        } else {
            throw new HttpException('Rut not valid', HttpStatus.BAD_REQUEST); 
        } 
    }
    
    async findAllUser(): Promise<UserDTO[]> {
        const user = await this.userRepository.find();
        return user;
    }

    async findOneUser(id: number, userEntity?: User) {
        const user = await this.userRepository.findOne(id)
        .then(u => !userEntity ? u : !!u && userEntity.id === u.id ? u : null)

        if (!user) throw new NotFoundException('User does not exists or unauthorized')

        return user;
    } 

    async findOneUserByRut(rut: string){
        return await this.userRepository
            .createQueryBuilder('user')
            .where({ rut })
            .addSelect('user.password')
            .getOne()
    } 

    async updateUser(id: number, newValue: EditUserDto, userEntity?: User){
        const user = await this.findOneUser(id, userEntity);
        const editedUser = await Object.assign(user, newValue);
        return await this.userRepository.save(editedUser);
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

    private rutFormat(rut: string) {
        var valor = rut.replace('.','').replace('.','').replace('-','');

        // Aislar Cuerpo y Dígito Verificador
        let cuerpo = Number(valor.slice(0,-1));
        let dv = valor.slice(-1).toUpperCase();

        return { cuerpo, dv }
    }
}
