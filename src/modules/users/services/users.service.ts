import { Injectable, forwardRef, Inject, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from '../../../entities';
import { UserDTO, CreateUserDTO, EditUserDto } from '../dtos';
import { AppRoles } from '../../../common/enums';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
            private readonly userRepository: Repository<User>,
    ){}

    async addAdminUser(userDTO: CreateUserDTO): Promise<UserDTO> {
        const { rut, ...rest } = userDTO;
        let rutformat = await this.rutformat(rut)
        let value = await this.dgv(rutformat)
        
        if (value===true) {
            const userInDb = await this.userRepository.findOne({ 
                where: { rut } 
            }); 
            if (userInDb) {
                throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message:'User already exists'}, HttpStatus.BAD_REQUEST);    
            }
            const user: User = await this.userRepository.create({
                rut,
                roles: [AppRoles.Admin],
                ...rest           
            });

            await this.userRepository.save(user)
            const { password, ...rest2 } = user
            return rest2;
        } else {
            throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message:'Rut not valid'}, HttpStatus.BAD_REQUEST); 
        } 
    }

    async addGuardUser(userDTO: CreateUserDTO): Promise<UserDTO> {
        const { rut, ...rest } = userDTO;
        let rutformat = await this.rutformat(rut)
        let value = await this.dgv(rutformat)
        
        if (value===true) {
            const userInDb = await this.userRepository.findOne({ 
                where: { rut } 
            }); 
            if (userInDb) {
                throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message:'User already exists'}, HttpStatus.BAD_REQUEST);    
            }
            const user: User = await this.userRepository.create({
                rut,
                roles: [AppRoles.Guard],
                ...rest           
            });

            await this.userRepository.save(user)
            const { password, ...rest2 } = user
            return rest2;
        } else {
            throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message:'Rut not valid'}, HttpStatus.BAD_REQUEST); 
        } 
    }
    
    async findAllUsers(): Promise<UserDTO[]> {
        const users = await this.userRepository.find();
        return users;
    }
    
    async findAllGuards( userEntity?: User): Promise<UserDTO[]> {
        const user = await this.userRepository.find({
            where: { roles: ['Guard']}
        })
        
        return user;
    }

    async findAllGuardsById( ids: number[]): Promise<UserDTO[]> {
        const user = await this.userRepository
        .createQueryBuilder('user')
        .where("user.user_id IN (:...ids)", { ids: ids })
        .orderBy("user.user_id")
        .getMany();
        
        return user;
    }

    async findOneUser(id: number, userEntity?: User) {
        const user = await this.userRepository.findOne(id)
        .then(u => !userEntity ? u : !!u && userEntity.id === u.id ? u : null)

        if (!user) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'User does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
        
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
        const user = await this.findOneUser(id, userEntity)
        .then(u => !userEntity ? u : !!u && userEntity.id === u.id ? u : null);

        if (!user) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'User does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
        
        
        const editedUser = await Object.assign(user, newValue);
        
        return await this.userRepository.save(editedUser);
    }

    rutformat(rut:string){
        
        // Despejar Puntos
        let valor = rut.replace('.','').replace('.','');
        return valor;
    }

    dgv(rut: string){  
        
        // Valida el rut con su cadena completa "XXXXXXXX-X"
        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rut ))
                return false;
            var tmp 	= rut.split('-');
            var digv	= tmp[1]; 
            var rut 	= tmp[0];
            if ( digv == 'K' ) digv = 'k' ;
            return (this.dv(rut) == digv );

    }

    dv(T) {
        var M=0,S=1;
            for(;T;T=Math.floor(T/10))
                S=(S+T%10*(9-M++%6))%11;
            return S?S-1:'k';
    }
}
