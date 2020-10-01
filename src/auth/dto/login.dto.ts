import { ApiProperty } from "@nestjs/swagger";

export class loginDto {
    @ApiProperty()
    rut: string;
    @ApiProperty()
    password: string;
}