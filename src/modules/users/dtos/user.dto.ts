import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional, ArrayNotContains, IsNotEmpty, IsLatLong, IsLatitude, isLatLong, isMilitaryTime, IsMilitaryTime } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppRoles } from '../../../common/enums'
import { GuardsLocation } from 'src/entities';

export class CreateUserDTO {

    @IsString() @ApiProperty()
    readonly rut: string; 

    @IsString() @ApiProperty()
    readonly firstname: string;

    @IsString() @ApiProperty()
    readonly lastname: string;
    
    @ApiProperty()
    readonly phone: string;

    @IsOptional()
    @IsEnum(AppRoles,{ 
        message: `illegal value`
    })
    @ArrayNotContains(['Admin', 'Guard'],{ 
        message: `role parameter is not allowed`
    })
    readonly roles: AppRoles[];

    @IsOptional() @IsEmail() @ApiProperty()
    readonly email?: string;

    @IsString() @MinLength(8) @MaxLength(200) @ApiProperty()
    readonly password: string;
}

export class UserDTO {
    readonly id: number;
    readonly firstname: string;
    readonly lastname: string;
    readonly roles: string[];
    readonly rut: string;
    readonly phone: string;
    readonly email: string;
}

export class GuardLocation {
    
    @IsNotEmpty()
    @IsLatLong()
    @ApiProperty()
    readonly location: string
}

