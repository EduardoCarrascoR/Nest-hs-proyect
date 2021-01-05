import { ApiProperty } from "@nestjs/swagger";
import { IsMilitaryTime, IsNumber, IsString } from "class-validator";
import { Shift } from "src/entities";

export class CreateVisitDTO {
    
    @IsString() @ApiProperty()
    readonly name: string;

    @IsString() @ApiProperty()
    readonly patent: string;

    @IsString() @ApiProperty()
    readonly rut: string;

    @IsMilitaryTime() @ApiProperty()
    readonly in: string;
    
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
    readonly shift?: Shift[];

}

export class UpdateVisitDTO {
    
    @IsNumber() @ApiProperty()
    readonly shiftId: number;

    @IsNumber() @ApiProperty()
    readonly visitId: number;

    @IsMilitaryTime() @ApiProperty()
    readonly out?: string;
}
