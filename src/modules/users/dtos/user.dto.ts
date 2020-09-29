import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsNumber, IsPhoneNumber, IsEnum, IsOptional } from 'class-validator';
import { AppRoles } from '../../../common/enums'
import { ApiProperty } from '@nestjs/swagger';
import { EnumToString } from 'src/common/helpers/enumToString';

export class CreateUserDTO {

    @IsString() @ApiProperty()
    readonly rut: string; 

    @IsString() @ApiProperty()
    readonly firstname: string;

    @IsString() @ApiProperty()
    readonly lastname: string;
    
    @IsEnum(AppRoles, {
        each: true,
        message: `must be a valid role value, ${ EnumToString(AppRoles)}`
    }) @ApiProperty()
    readonly roles: string[];
    
    @ApiProperty()
    readonly phone: string;

    @IsOptional() @IsEmail() @ApiProperty()
    readonly email?: string;

    @IsString() @MinLength(8) @MaxLength(200) @ApiProperty()
    readonly password: string;
}

export class UserDTO {
    readonly firstname: string;
    readonly lastname: string;
    @IsEnum(AppRoles, {
        each: true,
        message: `must be a valid role value, ${ EnumToString(AppRoles) }`
    })
    readonly roles: string[];
    readonly rut: string;
    readonly phone: string;
    readonly email: string;
}
