import { IsDate, IsEnum, IsISO8601, IsMilitaryTime, IsNumber, IsString, NotContains } from "class-validator";
import { shiftState } from "../../../common/enums";
import { shiftType } from "../../../common/enums/shift-types.enum";
import { EnumToString } from "../../../common/helpers/enumToString";
import { UserDTO } from "../../users/dtos";


export class CreateShiftDTO {
    
    @IsEnum(shiftType,{ 
        message: `must be a valid role value, ${ EnumToString(shiftType) }`
    })
    readonly type: shiftType;

    @IsMilitaryTime()
    readonly start: string;

    @IsMilitaryTime()
    readonly finish: string;

    @IsISO8601()
    readonly date: Date;

    @IsNumber()
    readonly client: number;

    readonly state: shiftState;
    
    readonly guards?: UserDTO[]
    
    @IsString()
    readonly shiftPlace: string;
}

export class ShiftDTO {
    
    @IsEnum(shiftType,{ 
        message: `must be a valid type value, ${ EnumToString(shiftType) }`
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
