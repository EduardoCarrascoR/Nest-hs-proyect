import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsISO8601, IsMilitaryTime, IsNumber, IsOptional, IsString, NotContains } from "class-validator";
import { ClientDTO } from "src/modules/clients/dtos";
import { UserDTO } from "../../users/dtos";
import { NewsDTO } from "src/modules/news/dtos/new.dto";
import { shiftState, shiftType } from "../../../common/enums";
import { EnumToString } from "../../../common/helpers/enumToString";
import { VisitDTO } from "src/modules/visits/dtos/visits";
import { ReportDTO } from "src/modules/reports/dtos/report.dto";


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
    readonly clientClient?: ClientDTO
    readonly news?: NewsDTO[]
    readonly reports?: ReportDTO[]
    readonly visits?: VisitDTO[]

}

export class ShiftPaginationDTO {
    
    @IsNumber()
    @ApiProperty()
    readonly page: number;

    @IsNumber()
    @ApiProperty()
    readonly limit: number;
    
    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly client?: string;
    
    @IsISO8601()
    @IsOptional() 
    @ApiProperty()
    readonly mes?: Date;
}

export class ShiftHoursWorkedDTO {

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly idGuard?: number;
        
}

