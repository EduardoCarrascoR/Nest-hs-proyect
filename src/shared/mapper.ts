import { User } from "../entities/User.entity";
import { UserDTO } from "src/modules/users/dtos/user.DTO";

export const toUserDto = (data: User): UserDTO => {  
    const { firstname, lastname, roles,
        rut, phone, email, password, } = data;
    let userDto: UserDTO = {  
        firstname, 
        lastname,
        roles,
        rut, 
        phone, 
        email, 
        password,  
    };
    return userDto;
};