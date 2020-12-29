import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report, Shift, User, Workedhours } from '../../../entities';
import { Brackets, Column, getConnection, Repository } from 'typeorm';
import { CreateReportDTO } from '../dtos/report.dto';
import { ShiftsService } from 'src/modules/shifts/services/shifts.service';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
            private readonly reportRepository: Repository<Report>,
            private readonly ShiftService: ShiftsService,
    ) {}

    async addReport(reportDTO: CreateReportDTO, UserEntity?: User) {
        await getConnection().transaction(async transaction => {
            const shift: Shift = await transaction.findOne(Shift, { where: { shiftId: reportDTO.shiftId } })
            const shiftInitalizedOrFinalized: Workedhours = await transaction.findOne(Workedhours, { where: { shiftHoursId: reportDTO.shiftId, guardId: UserEntity.id }})
            
            if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
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
            
            return await report;
        })
    }

    async findMonthReport() {
        let reports, policeType, ambulanceType, firefighterType, office1Type, office2Type

        await getConnection().transaction(async transaction => {
            let beforeDay = `${(await this.dateInDB()).year}-${(await this.dateInDB()).month}-01`
            let lastDay = (await this.dateInDB()).lastDay 

            reports = await transaction
                .queryRunner
                .query(`select user.user_id, concat(user.firstname,' ',user.lastname) as 'guard', user.phone, user.rut, report.type, report.time, shift.date, shift.shift_place as 'place' from report
                inner join shift
                on report.shift_shift_id=shift.shift_id
                inner join user
                on report.shift_guard_id=user.user_id
                where shift.date BETWEEN '${beforeDay}' AND '${lastDay}'
                limit 10`)
            /* reports = await transaction
                .createQueryBuilder()
                .select("user.user_id")
                .addSelect("concat(user.firstname,' ',user.lastname)", "guard")
                .addSelect("user.phone")
                .addSelect("user.rut")
                .addSelect("report.type")
                .addSelect("report.time")
                .addSelect("shift.date")
                .addSelect("shift.shiftPlace")
                .from(Report, "report")
                .innerJoin("report.shiftShiftId", "shift","shift.shift_id=report.shift_shift_id")
                .innerJoinAndSelect(Shift,"shift","shift.shift_id=report.shift_shift_id")
                .leftJoinAndSelect(User,"user","user.id=report.guardId")
                .orderBy("report.reportId", "DESC")
                .where(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                .limit(10)
                .getMany() */

            policeType = await transaction
                .createQueryBuilder()
                .select("report")
                .from(Report, "report")
                .leftJoinAndSelect("report.shiftShiftId", "shift")
                .where("report.type = :type", { type: "Police" })
                .andWhere(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                .orderBy("shift.date", "ASC")
                .getCount()

            ambulanceType = await transaction
                .createQueryBuilder()
                .select("report")
                .from(Report, "report")
                .leftJoinAndSelect("report.shiftShiftId", "shift")
                .where("report.type = :type", { type: "Ambulance" })
                .andWhere(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                .orderBy("shift.date", "ASC")
                .getCount()

            firefighterType = await transaction
                .createQueryBuilder()
                .select("report")
                .from(Report, "report")
                .leftJoinAndSelect("report.shiftShiftId", "shift")
                .where("report.type = :type", { type: "Firefighter" })
                .andWhere(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                .orderBy("shift.date", "ASC")
                .getCount()

            office1Type = await transaction
                .createQueryBuilder()
                .select("report")
                .from(Report, "report")
                .leftJoinAndSelect("report.shiftShiftId", "shift")
                .where("report.type = :type", { type: "Office1" })
                .andWhere(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                .orderBy("shift.date", "ASC")
                .getCount()

            office2Type = await transaction
                .createQueryBuilder()
                .select("report")
                .from(Report, "report")
                .leftJoinAndSelect("report.shiftShiftId", "shift")
                .where("report.type = :type", { type: "Office2" })
                .andWhere(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                .orderBy("shift.date", "ASC")
                .getCount()
        })

        return { 
            reports, 
            types: [
                { y: policeType, label: 'Police' },
                { y: ambulanceType, label: 'Ambulance' },
                { y: firefighterType, label: 'Firefighter' },
                { y: office1Type, label: 'Office1' },
                { y: office2Type, label: 'Office2' }
            ]}
    }

    async dateInDB() {
        let monthDB = await this.reportRepository
            .query("SELECT MONTH(CURDATE())")
        let yearDB = await this.reportRepository
            .query("SELECT YEAR(CURDATE())")
        let lastDayDB = await this.reportRepository
            .query("SELECT LAST_DAY(CURDATE())")

        let monthjson =  JSON.stringify(monthDB[0])
        let yearjson =  JSON.stringify(yearDB[0])
        let lastDayjson =  JSON.stringify(lastDayDB[0])

        let month = monthjson.slice(monthjson.indexOf(":")+2, -2)
        let year = yearjson.slice(yearjson.indexOf(":")+2, -2)
        let lastDay = lastDayjson.slice(lastDayjson.indexOf(":")+2, -16)

        return { month, year, lastDay }
    }
}
