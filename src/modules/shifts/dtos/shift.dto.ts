import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsISO8601, IsMilitaryTime, IsNumber, IsOptional, IsString, NotContains } from "class-validator";
import { shiftState } from "../../../common/enums";
import { shiftType } from "../../../common/enums/shift-types.enum";
import { EnumToString } from "../../../common/helpers/enumToString";
import { UserDTO } from "../../users/dtos";


export class CreateShiftDTO {
    
    @IsEnum(shiftType,{ 
        message: `must be a valid role value, ${ EnumToString(shiftType) }`
    })
    @ApiProperty()
    readonly type: shiftType;

    @IsMilitaryTime()
    @ApiProperty()
    readonly start: string;

    @IsMilitaryTime()
    @ApiProperty()
    readonly finish: string;

    @IsISO8601({},{ each: true})
    @ApiProperty()
    readonly dates: Date[];

    @IsNumber()
    @ApiProperty()
    readonly client: number;

    @IsNumber({},{ each: true, message: `Must be a valid array of Ids value`})
    @ApiProperty()
    readonly guardsIds?: number[]
    
    @IsString()
    @ApiProperty()
    readonly shiftPlace: string;
}

export class ShiftDTO {
    
    @IsEnum(shiftType,{ 
        message: `Must be a valid type value, ${ EnumToString(shiftType) }`
    })
    readonly type: shiftType;

    @IsMilitaryTime()
    readonly start: string;

    @IsMilitaryTime()
    readonly finish?: string;
    
    @IsISO8601()
    readonly date: Date;

    readonly shiftPlace: string;

    @IsEnum(shiftState,{ 
        message: `must be a valid state value, ${ EnumToString(shiftState) }`
    })
    readonly state: shiftState;
    
    readonly guards?: UserDTO[]

}

export class ShiftPaginationDTO {
    
    @IsNumber()
    @ApiProperty()
    readonly page: number;

    @IsNumber()
    @ApiProperty()
    readonly limit: number;

}

export class ShiftHoursWorkedDTO {

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly idGuard?: number;
        
}

