import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report, Shift, User, Workedhours } from '../../../entities';
import { getConnection, Repository } from 'typeorm';
import { CreateReportDTO } from '../dtos/report.dto';
import { AppGateway } from 'src/app.gateway';
import { time } from 'console';
import { ShiftsService } from 'src/modules/shifts/services/shifts.service';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
            private readonly reportRepository: Repository<Report>,
            private readonly ShiftService: ShiftsService,
            private gateway: AppGateway
    ) {}

    async addReport(reportDTO: CreateReportDTO, UserEntity?: User) {
        await getConnection().transaction(async transaction => {
            const shift: Shift = await transaction.findOne(Shift, { where: { shiftId: reportDTO.shiftId } })
            const shiftInitalizedOrFinalized = await transaction.findOne(Workedhours, { where: { shiftHoursId: reportDTO.shiftId, guardId: UserEntity.id }})
            if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)
            if(!shiftInitalizedOrFinalized || shiftInitalizedOrFinalized.start === null ) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'shift has not been started or unauthorized'},HttpStatus.NOT_FOUND)
            if(shiftInitalizedOrFinalized.finish !== null) throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'shift has been finished or unauthorized'},HttpStatus.CONFLICT)
            const report: Report = await transaction.create(Report, {
                type: reportDTO.type,
                clientId: reportDTO.clientId,
                shiftShiftId: shift,
                guardId: UserEntity.id,
                time: (await this.ShiftService.timeInDB()).time
            })
            await transaction.save(report);
            this.gateway.wss.emit('newReport', report)
            return await report;
        })
    }
}
