import { IsNumber, IsString } from "class-validator";
import { Shift } from "src/entities";

export class CreateNewDTO {

    @IsString()
    readonly title: string;
    
    @IsString()
    readonly description: string;
    
    @IsNumber()
    readonly shiftId: number;
    
}

export class NewsDTO {

    @IsString()
    readonly title: string;
    
    @IsString()
    readonly description: string;
     
    @IsNumber()
    readonly clientId: number;
    
    readonly shift: Shift;
}
