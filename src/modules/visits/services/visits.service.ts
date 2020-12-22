import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Shift, User, Visit, Workedhours } from 'src/entities';
import { UsersService } from 'src/modules/users/services/users.service';
import { getConnection, Repository } from 'typeorm';
import { CreateVisitDTO, UpdateVisitDTO, VisitDTO } from '../dtos/visits';

@Injectable()
export class VisitsService {
    constructor(
        @InjectRepository(Visit)
        readonly visitRepository: Repository<Visit>,
        readonly userService: UsersService
    ) {}

    async addVisit(visitDTO: CreateVisitDTO, UserEntity?: User) {
        const { shiftId, ...rest } = visitDTO;
        let visit: Visit
        let rutformat = await this.userService.rutformat(rest.rut)
        let value = await this.userService.dgv(rutformat)
        if(value===false) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message:'Rut is not valid'}, HttpStatus.BAD_REQUEST);

        await getConnection().transaction(async transaction => {
            const shift: Shift = await transaction.findOne(Shift, { where: { shiftId: shiftId } })
            const shiftInitalizedOrFinalized: Workedhours = await transaction.findOne(Workedhours, { where: { shiftHoursId: visitDTO.shiftId, guardId: UserEntity.id }})
            const visitInDB: Visit = await transaction.findOne(Visit, { where: { patent: rest.patent, rut: rest.rut }})
            
            if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
            if(!shiftInitalizedOrFinalized || shiftInitalizedOrFinalized.start === null ) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'shift has not been started or unauthorized'},HttpStatus.NOT_FOUND)
            if(shiftInitalizedOrFinalized.finish !== null) throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'shift has been finished or unauthorized'},HttpStatus.CONFLICT)
          

            if(visitInDB) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: 'Visit already exists, please verify the data'}, HttpStatus.BAD_REQUEST)

            visit = await transaction.create(Visit, {
                ...rest,
                shift
            })
            await transaction.save(visit)
            
        })
        return await visit;
    }

    async updateVisit(visitDTO: UpdateVisitDTO, UserEntity?: User) {
        let visit
        await getConnection().transaction(async transaction => {
            const shift: Shift = await transaction.findOne(Shift, { where: { shiftId: visitDTO.shiftId } })
            const shiftInitalizedOrFinalized: Workedhours = await transaction.findOne(Workedhours, { where: { shiftHoursId: visitDTO.shiftId, guardId: UserEntity.id }})
            const visitInDB: Visit = await transaction.findOne(Visit, { where: { visitId: visitDTO.visitId }})
            
            if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
            if(!shiftInitalizedOrFinalized || shiftInitalizedOrFinalized.start === null ) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'shift has not been started or unauthorized'},HttpStatus.NOT_FOUND)
            if(shiftInitalizedOrFinalized.finish !== null) throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'shift has been finished or unauthorized'},HttpStatus.CONFLICT)
          

            if(!visitInDB) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Visit not found, please verify the data'}, HttpStatus.NOT_FOUND)
            if(!visitInDB.in) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Visit in not registred, please verify the data'}, HttpStatus.NOT_FOUND)
            if(visitInDB.out) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: 'Visit out registred, please verify the data'}, HttpStatus.BAD_REQUEST)

            visit = await transaction.update(Visit, { visitId: visitDTO.visitId }, {
                out: visitDTO.out
            })
            
        })
        return await true;
    }

    async findVisitsShift(shiftId: number, UserEntity?: User) {
        let visits: Visit[];

        await getConnection().transaction(async transaction => {
            const shiftInDB = await transaction
                .createQueryBuilder()
                .select("shift")
                .from(Shift, "shift")
                .leftJoinAndSelect("shift.guards", "guard")
                .where("guard.id = :user_id", { user_id: UserEntity.id })
                .where("shift.shiftId = :shift_id", { shift_id: shiftId })
                .getOne();
                
            visits = await transaction.find(Visit, { where: { shiftShiftId: shiftId }, relations: ["shift"]})
                
            if (!shiftInDB) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
            if(!visits) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Visits not found" }, HttpStatus.NOT_FOUND)


        })

        return visits
    }
}
