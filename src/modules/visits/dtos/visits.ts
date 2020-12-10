import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Shift } from "src/entities";

export class CreateVisitDTO {
    
    @IsString() @ApiProperty()
    readonly name: string;

    @IsString() @ApiProperty()
    readonly patent: string;

    @IsString() @ApiProperty()
    readonly rut: string;

    @IsNumber() @ApiProperty()
    readonly shiftId: number;

}

export class VisitDTO {
    
    @IsString() @ApiProperty()
    readonly name: string;

    @IsString() @ApiProperty()
    readonly patent: string;

    @IsString() @ApiProperty()
    readonly rut: string;

    @IsNumber() @ApiProperty()
    readonly shifts: Shift[];

}
