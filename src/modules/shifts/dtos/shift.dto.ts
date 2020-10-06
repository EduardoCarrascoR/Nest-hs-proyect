import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { shiftState } from "src/common/enums";
import { shiftType } from "src/common/enums/shift-types.enum";
import { EnumToString } from "src/common/helpers/enumToString";
import { UserDTO } from "src/modules/users/dtos/user.dto";


export class CreateShiftDTO {
    
    @IsEnum(shiftType,{ 
        message: `must be a valid role value, ${ EnumToString(shiftType) }`
    })
    readonly type: shiftType;

    @IsDate()
    readonly start: Date;

    @IsDate()
    readonly finish: Date;

    @IsDate()
    readonly date: Date;

    @IsNumber()
    readonly clientClientId: number;
    
    readonly guards: UserDTO[]
    
    @IsString()
    readonly shift_place: string;
}

export class ShiftDTO {
    
    @IsEnum(shiftType,{ 
        message: `must be a valid role value, ${ EnumToString(shiftType) }`
    })
    readonly type: shiftType;
    @IsDate()
    readonly start: Date;
    @IsDate()
    readonly finish: Date;
    @IsDate()
    readonly date: Date;
    readonly shiftPlace: string;
    @IsEnum(shiftState,{ 
        message: `must be a valid role value, ${ EnumToString(shiftState) }`
    })
    readonly state: shiftState;

}
