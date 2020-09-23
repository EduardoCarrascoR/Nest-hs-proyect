import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";


export class ClientDTO {

    @IsString() @ApiProperty()
    readonly name: string;

    @IsString() @ApiProperty()
    readonly phone: string;

    @IsEmail()  @ApiProperty()
    readonly email: string;

    @IsString() @ApiProperty()
    readonly address: string;
}