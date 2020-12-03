import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/modules/users/dtos';
import { UsersService } from 'src/modules/users/services/users.service';
import { getConnection, Repository } from 'typeorm';
import { Shift, User, Workedhours } from '../../../entities';
import { CreateShiftDTO, ShiftDTO, ShiftHoursWorkedDTO, ShiftPaginationDTO } from '../dtos/shift.dto';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
            private readonly shiftRepository: Repository<Shift>,
            private readonly userService: UsersService,
    ) {}

    async findAllShift(): Promise<ShiftDTO[]> {
        const shifts = await this.shiftRepository.find({ relations: ["guards", "workedhours", "clientClient"] })
        return shifts;
    }

    async findAssignedShiftsGuard(UserEntity?: User, user_id?: number) {
        
        if(!UserEntity){
            const guardShifts = await this.shiftRepository
            .createQueryBuilder("shift")
            .leftJoinAndSelect("shift.guards", "guard")
            .where("guard.id = :user_id", { user_id: user_id })
            .getMany();
            return guardShifts

        } else {
            const guardShifts = await this.shiftRepository
            .createQueryBuilder("shift")
            .leftJoinAndSelect("shift.guards", "guard")
            .where("guard.id = :user_id", { user_id: UserEntity.id })
            .getMany();
            return guardShifts
        
        }
        
    } 

    async addShift(shiftDTO: CreateShiftDTO) {
        const { guardsIds, dates, ...rest } = shiftDTO
        let guards: UserDTO[];
        const daterepeated = dates.every( (valor, indice, lista) => {return (lista.indexOf(valor) === indice);})
        if(daterepeated !== false){
            await getConnection().transaction(async transaction => {
                let valueDates:boolean[] = []
                guards = await this.userService.findAllGuardsById(guardsIds)
                for await (const element of dates) {
                    const shiftDB = await transaction.findOne(Shift,{ 
                        where: { start: rest.start, finish: rest.finish, type: rest.type, date: element}
                    })
                    if(shiftDB === undefined) valueDates.push(false);
                    if(shiftDB !== undefined) valueDates.push(true);
    
                }
                let value = await valueDates.every((element) => { return element !== true })
                if(!value) throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'Some of the shift exist or you are not authorized'},HttpStatus.CONFLICT)
    
                for await (const element of dates) {
                    const shift: Shift = await transaction.create(Shift,{ 
                        ...rest,
                        guards,
                        date: element
                    })
                    await transaction.save(shift)
                }
                if(!value) throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'Some of the shift duplicado exist or you are not authorized'},HttpStatus.CONFLICT)
    
            })
        } else {
            throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: 'Some  of the repeated dates or you are not authorized'},HttpStatus.BAD_REQUEST)
        }
        
        return true;
    }

    async shiftInicialized(shiftId: number, clientId: number, UserEntity?: User, user_id?: number) {
        const shift = await this.shiftRepository.findOne({ shiftId, client: clientId },{ relations: ["guards"] })
        if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)

        if(!UserEntity) { 
            await getConnection().transaction(async transaction => {
                const guardhoursDB: Workedhours = await transaction.findOne(Workedhours,{ 
                    guardId: user_id,
                    shiftHoursId: shiftId
                })
                if(!guardhoursDB) {
                    const guardhours: Workedhours = await transaction.create(Workedhours,{ 
                        guardId: user_id,
                        start: (await this.timeInDB()).time,
                        shiftHours: shift
                    })
                    await transaction.save(guardhours)
                    return await guardhours;
                } else throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'It isn`t possible to start this shift since it has already started'},HttpStatus.CONFLICT)
                
            })        
        } else { 
            if(shift.guards.some(u => u.id === UserEntity.id)) { 
                await getConnection().transaction(async transaction => {
                    const guardhoursDB: Workedhours = await transaction.findOne(Workedhours,{ 
                        guardId: UserEntity.id,
                        shiftHoursId: shiftId
                    })
                    if(!guardhoursDB) {
                        const guardhours: Workedhours = await transaction.create(Workedhours,{ 
                            guardId: UserEntity.id,
                            start: (await this.timeInDB()).time,
                            shiftHours: shift
                        })
                        await transaction.save(guardhours)
                        return await guardhours;
                    } else throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'It isn`t possible to start this shift since it has already started'},HttpStatus.CONFLICT)
                    
                })
                
            } else {
                throw new HttpException({ success: false, status: HttpStatus.UNAUTHORIZED, message: 'You`re unauthorized to upate this shift'},HttpStatus.UNAUTHORIZED)
            }
        }    
    }

    async shiftFinalized(shiftId: number, clientId: number, UserEntity?: User, user_id?: number) {
        const shift = await this.shiftRepository.findOne({ shiftId, client: clientId },{ relations: ["guards"] })
        if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)

        if(!UserEntity) { 
            await getConnection().transaction(async transaction => {
                const guardhoursDB: Workedhours = await transaction.findOne(Workedhours,{ 
                    guardId: user_id,
                    shiftHoursId: shiftId
                })
                if(!guardhoursDB || guardhoursDB.start === null ) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'It isn`t possible to finish this shift since it has not already stared'},HttpStatus.NOT_FOUND)
                if(guardhoursDB.finish === null) {
                    await transaction.update(Workedhours, { shiftHoursId: shiftId, guardId: user_id }, { finish: (await this.timeInDB()).time })
                    return await true;    
                } else throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'It isn`t possible to finish this shift since it has already finished'},HttpStatus.CONFLICT)
            })

        } else { 
            if(shift.guards.some(u => u.id === UserEntity.id)) { 
                await getConnection().transaction(async transaction => {
                    const guardhoursDB: Workedhours = await transaction.findOne(Workedhours,{ 
                        guardId: UserEntity.id,
                        shiftHoursId: shiftId
                    })
                    if(!guardhoursDB || guardhoursDB.start === null ) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'It isn`t possible to finish this shift since it has not already stared'},HttpStatus.NOT_FOUND)
                    if(guardhoursDB.finish === null) {
                        await transaction.update(Workedhours, { shiftHoursId: shiftId, guardId: UserEntity.id }, { finish: (await this.timeInDB()).time })
                        return await true;    
                    } else throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'It isn`t possible to finish this shift since it has already finished'},HttpStatus.CONFLICT)
                })
                
            } else {
                throw new HttpException({ success: false, status: HttpStatus.UNAUTHORIZED, message: 'You`re unauthorized to upate this shift'},HttpStatus.UNAUTHORIZED)
            }
        }
    }

    async  getShiftWithPagination(shiftPagination: ShiftPaginationDTO) {
        const skip =  shiftPagination.limit*(shiftPagination.page -1);
        let pages

        const paginatedShift = await getConnection()
            .createQueryBuilder()
            .select("shift")
            .from(Shift, "shift")
            .leftJoinAndSelect("shift.guards", "guard")
            .leftJoinAndSelect("shift.clientClient", "client")
            .leftJoinAndSelect("shift.workedhours", "workedhour")
            .skip(skip)
            .take(shiftPagination.limit)
            .getMany();
        const shiftCount = await getConnection()
            .createQueryBuilder()
            .select("shift")
            .from(Shift, "shift")
            .getCount();

        pages = await Math.ceil( shiftCount/ shiftPagination.limit);
        if (!paginatedShift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shifts does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
        if (!shiftCount) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: `Shifts doesn't exists or unauthorized`}, HttpStatus.NOT_FOUND)
        return { pages, pageSelected: shiftPagination.page, paginatedShift } 
    }

    async timeInDB() {
        let timeDB = await this.shiftRepository
            .query("SELECT CURTIME()")
        let json =  JSON.stringify(timeDB[0])
        let time = json.slice(json.indexOf(":")+2, -2)
        return { time }
    }
}
