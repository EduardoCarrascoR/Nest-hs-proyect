import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsISO8601, IsString } from "class-validator";


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

export class ReportClientDTO {

    @IsISO8601()
    date: Date;
}
