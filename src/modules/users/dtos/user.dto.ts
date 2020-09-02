import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsNumber, IsPhoneNumber } from 'class-validator';
import { UserRole } from '../enums'
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
    @IsNumber() @ApiProperty()
    readonly rutSD: number; 

    @IsString() @ApiProperty()
    readonly rutDv: string;

    @IsString() @ApiProperty()
    readonly firstname: string;

    @IsString() @ApiProperty()
    readonly lastname: string;
    
    @IsString() @ApiProperty()
    readonly role: string;
    
    @ApiProperty()
    readonly phone: string;

    @IsEmail() @ApiProperty()
    readonly email: string;

    @IsString() @MinLength(8) @MaxLength(200) @ApiProperty()
    readonly password: string;
}

export class UserDTO {
    readonly firstname: string;
    readonly lastname: string;
    readonly role: string;
    readonly rut: string;
    readonly phone: string;
    readonly email: string;
    readonly password: string;
}

export class UpdateUserDTO {
    @ApiProperty()
    readonly firstname?: string;
    @ApiProperty()
    readonly lastname?: string;
    @ApiProperty()
    readonly phone?: string;
    @ApiProperty()
    readonly password?: string;
    @ApiProperty()
    readonly email?: string;

}

export class LoginUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}