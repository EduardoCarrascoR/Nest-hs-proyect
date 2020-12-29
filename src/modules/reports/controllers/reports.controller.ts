import { Body, Controller, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppResources } from 'src/common/enums';
import { User as UserEntity} from '../../../entities';
import { Auth, User } from '../../../common/decorators';
import { CreateReportDTO } from '../dtos/report.dto';
import { ReportsService } from '../services/reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportService: ReportsService
    ){}

    @Auth({
        possession: 'own',
        action: 'create',
        resource: AppResources.REPORT,
    })
    @Post()
    async createReport(@Body() reportDTO: CreateReportDTO, @User() user: UserEntity, @Res() res) {
        const report = await this.reportService.addReport(reportDTO, user);

        return await res.status(HttpStatus.CREATED).json({ success: true, message: 'Report created', report })
    }

    @Auth({
        possession: 'any',
        action: 'read',
        resource: AppResources.REPORT,
    })
    @Get('/monthReport')
    async getMonthReport(@Res() res) {
        const reports = await this.reportService.findMonthReport();
        if(reports.reports.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Reports not found" }, HttpStatus.NOT_FOUND)
        if(reports.types.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Types of report not found" }, HttpStatus.NOT_FOUND)

        return res.status(HttpStatus.ACCEPTED).json({ success: true, types: reports.types, reports: reports.reports });
    }

}
