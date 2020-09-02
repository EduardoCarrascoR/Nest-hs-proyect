import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsNumber } from 'class-validator';
import { UserRole } from '../enums'

export class CreateUserDTO {
    @IsNumber()
    readonly rutSD: number; 

    @IsString()
    readonly rutDv: string;

    @IsString()
    readonly firstname: string;

    @IsString()
    readonly lastname: string;
    
    @IsString()
    readonly role: string;
    
    readonly phone: string;

    @IsEmail()
    readonly email: string;

    @IsString() @MinLength(8) @MaxLength(200)
    readonly password: string;
}

export interface UserDTO {
    readonly firstname: string;
    readonly lastname: string;
    readonly role: string;
    readonly rut: string;
    readonly phone: string;
    readonly email: string;
    readonly password: string;
}

export interface UpdateUserDTO {
    readonly firstname?: string;
    readonly lastname?: string;
    readonly phone?: string;
    readonly password?: string;
    readonly email?: string;

}

export class LoginUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}