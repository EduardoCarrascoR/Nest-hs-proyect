import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
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

}
