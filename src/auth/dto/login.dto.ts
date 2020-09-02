import { ApiProperty } from "@nestjs/swagger";

export class loginDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}