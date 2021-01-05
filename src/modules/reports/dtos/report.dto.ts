import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { reportType } from "../../../common/enums/report-types.enum";
import { EnumToString } from "../../../common/helpers/enumToString";

export class CreateReportDTO {

    @IsEnum(reportType,{ 
        message: `must be a valid role value, ${ EnumToString(reportType) }`
    })
    @ApiProperty()
    readonly type: reportType; // seguerencia que sea un enum con los tipos de repostes que hay (bomberos, carabineros, ambulancia, oficina1 y oficina2)

    @IsNumber() @ApiProperty()
    readonly clientId: number;

    @IsNumber() @ApiProperty()
    readonly shiftId: number;

}
export class ReportDTO {

    readonly type: reportType; // seguerencia que sea un enum con los tipos de repostes que hay (bomberos, carabineros, ambulancia, oficina1 y oficina2)

    readonly time: string;
    readonly guardId: number;
    


}
