import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import * as momentjs from "moment";
import { GuardLocation, UserDTO } from 'src/modules/users/dtos';
import { UsersService } from 'src/modules/users/services/users.service';
import { GuardsLocation, Shift, User, Workedhours } from '../../../entities';
import { CreateShiftDTO, ShiftDTO, ShiftHoursWorkedDTO, ShiftPaginationDTO } from '../dtos/shift.dto';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
        private readonly shiftRepository: Repository<Shift>,
        @InjectRepository(GuardsLocation)
            private readonly userService: UsersService,
    ) {}

    async findAllShift() {
        const shifts: Shift[] = await this.shiftRepository.find({ relations: ["guards", "news", "workedhours", "clientClient", "reports"] })
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

    async shiftInicialized(shiftId: number, clientId: number, UserEntity?: User) {
        const shift = await this.shiftRepository.findOne({ shiftId, client: clientId },{ relations: ["guards"] })
        if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)

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

    async shiftFinalized(shiftId: number, clientId: number, UserEntity?: User) {
        const shift = await this.shiftRepository.findOne({ shiftId, client: clientId },{ relations: ["guards"] })
        if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)

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
            throw new HttpException({ success: false, status: HttpStatus.UNAUTHORIZED, message: 'You`re unauthorized to update this shift'},HttpStatus.UNAUTHORIZED)
        }
    }

    async getShiftWithPagination(shiftPagination: ShiftPaginationDTO) {
        const skip =  shiftPagination.limit*(shiftPagination.page -1);
        let pages, paginatedShift, shiftCount, value, connection = getConnection()
        let beforeDay = momentjs(shiftPagination.mes).startOf('month').format('YYYY-MM-DD');
        let lastDay = momentjs(shiftPagination.mes).endOf('month').format('YYYY-MM-DD');
        
        if(!shiftPagination.client && !shiftPagination.mes) value = 1
        if(shiftPagination.client && !shiftPagination.mes) value = 2
        if(shiftPagination.mes && !shiftPagination.client) value = 3
        if(shiftPagination.client && shiftPagination.mes) value = 4
        
        switch (value) {
            case 1:
                paginatedShift = await connection
                    .createQueryBuilder()
                    .select("shift")
                    .from(Shift, "shift")
                    .leftJoinAndSelect("shift.guards", "guard")
                    .leftJoinAndSelect("shift.clientClient", "client")
                    .leftJoinAndSelect("shift.workedhours", "workedhour")
                    .leftJoinAndSelect("shift.news","news")
                    .leftJoinAndSelect("shift.visits","visit")
                    .leftJoinAndSelect("shift.guardLocation","guardLocation")
                    .orderBy("shift.date", "DESC")
                    .skip(skip)
                    .take(shiftPagination.limit)
                    .getMany();

                shiftCount = await getConnection()
                    .createQueryBuilder()
                    .select("shift")
                    .from(Shift, "shift")
                    .getCount();
                break;
        
            case 2:
                paginatedShift = await connection
                    .createQueryBuilder()
                    .select("shift")
                    .from(Shift, "shift")
                    .leftJoinAndSelect("shift.guards", "guard")
                    .leftJoinAndSelect("shift.clientClient", "client")
                    .leftJoinAndSelect("shift.workedhours", "workedhour")
                    .leftJoinAndSelect("shift.news","news")
                    .leftJoinAndSelect("shift.visits","visit")
                    .leftJoinAndSelect("shift.guardLocation","guardLocation")
                    .where(`client.name = :clientName`, { clientName: shiftPagination.client })
                    .orderBy("shift.date", "DESC")
                    .skip(skip)
                    .take(shiftPagination.limit)
                    .getMany();

                shiftCount = await getConnection()
                    .createQueryBuilder()
                    .select("shift")
                    .from(Shift, "shift")
                    .leftJoinAndSelect("shift.clientClient", "client")
                    .where(`client.name=:clientName`, { clientName: shiftPagination.client })
                    .getCount();
                break;
                    
            case 3:
                paginatedShift = await connection
                    .createQueryBuilder()
                    .select("shift")
                    .from(Shift, "shift")
                    .leftJoinAndSelect("shift.guards", "guard")
                    .leftJoinAndSelect("shift.clientClient", "client")
                    .leftJoinAndSelect("shift.workedhours", "workedhour")
                    .leftJoinAndSelect("shift.news","news")
                    .leftJoinAndSelect("shift.visits","visit")
                    .leftJoinAndSelect("shift.guardLocation","guardLocation")
                    .where(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                    .orderBy("shift.date", "DESC")
                    .skip(skip)
                    .take(shiftPagination.limit)
                    .getMany();

                shiftCount = await getConnection()
                    .createQueryBuilder()
                    .select("shift")
                    .from(Shift, "shift")
                    .leftJoinAndSelect("shift.clientClient", "client")
                    .where(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                    .getCount();
                break;
        
            case 4:
                paginatedShift = await connection
                    .createQueryBuilder()
                    .select("shift")
                    .from(Shift, "shift")
                    .leftJoinAndSelect("shift.guards", "guard")
                    .leftJoinAndSelect("shift.clientClient", "client")
                    .leftJoinAndSelect("shift.workedhours", "workedhour")
                    .leftJoinAndSelect("shift.news","news")
                    .leftJoinAndSelect("shift.visits","visit")
                    .leftJoinAndSelect("shift.guardLocation","guardLocation")
                    .where(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                    .andWhere(`client.name=:clientName`, { clientName: shiftPagination.client })
                    .orderBy("shift.date", "DESC")
                    .skip(skip)
                    .take(shiftPagination.limit)
                    .getMany();

                shiftCount = await getConnection()
                    .createQueryBuilder()
                    .select("shift")
                    .from(Shift, "shift")
                    .leftJoinAndSelect("shift.clientClient", "client")
                    .where(`shift.date BETWEEN '${beforeDay}' AND '${lastDay}'`)
                    .andWhere(`client.client_id=:clientId`, { clientId: shiftPagination.client })
                    .orderBy("shift.date", "DESC")
                    .getCount();
                break;
        
        }
        pages = await Math.ceil( shiftCount/ shiftPagination.limit);
        if (!paginatedShift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shifts does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
        if (!shiftCount) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: `Shifts doesn't exists or unauthorized`}, HttpStatus.NOT_FOUND)
        return { pages, pageSelected: shiftPagination.page, paginatedShift } 
    }

    async getShiftById(shiftId: number, client: number) {
        let shift: Shift
        const connection = getConnection()
        await connection.transaction( async transaction => {
            shift = await transaction.findOne(Shift, { shiftId, client },{ relations: ["clientClient", "guards", "news", "reports", "visits"] })

        })
        if(!shift) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Shift not found." }, HttpStatus.BAD_REQUEST)
        return shift
    }

    async setLocation(shiftId: number, clientId: number, userId: number, GuardLocation: GuardLocation, userEntity?: User) {
        const conection = getConnection()
        let location: boolean, guardLocation: GuardLocation;
        const shift = await this.shiftRepository.findOne({ shiftId, client: clientId },{ relations: ["guards"] })
        if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)

        if(shift.guards.some(u => u.id === userEntity.id)) { 
            await conection.transaction( async transaction =>{
                const guardhoursDB: Workedhours = await transaction.findOne(Workedhours,{ 
                    guardId: userEntity.id,
                    shiftHoursId: shiftId
                })
                const userInDB: User = await transaction.findOne(User, { id:userId })
                    .then(u => !userEntity ? u : !!u && userEntity.id === u.id ? u : null)
                if(userInDB){
                    if(!guardhoursDB || guardhoursDB.start === null ) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'It isn`t possible to save location this shift since it has not already stared'},HttpStatus.NOT_FOUND)
                    if(guardhoursDB.finish === null) {

                        const guardLocationInDb = await transaction.findOne(GuardsLocation, { shiftId, clientId, userId })
                        if (guardLocationInDb === undefined) {
                            let timeLocation = (await this.timeInDB()).time
                            guardLocation = await transaction.create(GuardsLocation, { 
                                shiftId, 
                                clientId, 
                                userId: userEntity.id, 
                                location: GuardLocation.location, 
                                timeLocation
                            })
                            await transaction.save(GuardsLocation, guardLocation)
                            location = true;
                        } else {
                            if (guardLocationInDb) {
                                await transaction.update(GuardsLocation, { shiftId, clientId, userId }, { location: GuardLocation.location, timeLocation: (await this.timeInDB()).time } )
                                guardLocation = null;
                                location = false;
                            } else throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'It isn`t possible'},HttpStatus.CONFLICT)
                        }
                    } else throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'It isn`t possible to save location this shift since it has already finished'},HttpStatus.CONFLICT)
                } else {
                    if(!userInDB) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'User does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
                }
            })
        } else {
            throw new HttpException({ success: false, status: HttpStatus.UNAUTHORIZED, message: 'You`re unauthorized to update this location'},HttpStatus.UNAUTHORIZED)
        }
        return { location, guardLocation }
    }

    async deleteLocation(shiftId: number, clientId: number, userId: number, userEntity?: User) {
        const conection = getConnection()
        const shift = await this.shiftRepository.findOne({ shiftId, client: clientId },{ relations: ["guards"] })
        if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)

        if(shift.guards.some(u => u.id === userEntity.id)) { 
            conection.transaction( async transaction =>{
                const guardhoursDB: Workedhours = await transaction.findOne(Workedhours,{ 
                    guardId: userEntity.id,
                    shiftHoursId: shiftId
                })
                const userInDB: User = await transaction.findOne(User, { id:userId })
                    .then(u => !userEntity ? u : !!u && userEntity.id === u.id ? u : null)
                if(userInDB){
                    if(!guardhoursDB || guardhoursDB.start === null ) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'It isn`t possible to delete location this shift since it has not already stared'},HttpStatus.NOT_FOUND)
                    if(guardhoursDB.finish === null) {

                        const guardLocationInDb = await transaction.findOne(GuardsLocation, { shiftId, clientId, userId })
                        
                        if (guardLocationInDb) {
                            const guardLocation = await transaction.delete(GuardsLocation, { shiftId, clientId, userId })
                            return guardLocation;
                        } else throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'It isn`t possible to delete location this already not exists'},HttpStatus.CONFLICT)
                    } else throw new HttpException({ success: false, status: HttpStatus.CONFLICT, message: 'It isn`t possible to delete location this shift since it has already finished'},HttpStatus.CONFLICT)
                } else {
                    if(!userInDB) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'User does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
                }
            })
        } else throw new HttpException({ success: false, status: HttpStatus.UNAUTHORIZED, message: 'You`re unauthorized to delete this location'},HttpStatus.UNAUTHORIZED)
    }

    async timeInDB() {
        let timeDB = await this.shiftRepository
            .query("SELECT CURTIME()")
        let json =  JSON.stringify(timeDB[0])
        let time = json.slice(json.indexOf(":")+2, -2)
        return { time }
    }
}
