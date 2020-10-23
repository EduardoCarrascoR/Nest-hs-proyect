import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/modules/users/dtos';
import { UsersService } from 'src/modules/users/services/users.service';
import { getConnection, Repository } from 'typeorm';
import { shiftState } from '../../../common/enums';
import { Shift, User } from '../../../entities';
import { CreateShiftDTO, ShiftDTO, ShiftPaginationDTO } from '../dtos/shift.dto';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
            private readonly shiftRepository: Repository<Shift>,
            private readonly userService: UsersService
    ) {}

    async findAllShift(): Promise<ShiftDTO[]> {
        const shifts = await this.shiftRepository.find({ relations: ["guards"] })
        return shifts;
    }

    async addShift( shiftDTO: CreateShiftDTO) {
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

    async shiftInicialized(shiftId: number, shiftEntity?: Shift) {
        const shift = await this.shiftRepository.findOneOrFail()
        .then(s => !shiftEntity ? s : !!s && shiftEntity.shiftId === s.shiftId ? s : null)

        if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)
    
        const editedShift = await Object.assign(shift, { state: shiftState.Initialized })

        return await this.shiftRepository.save(editedShift);
    }

    async shiftFinalized(shiftId: number, shiftEntity?: Shift) {
        const shift = await this.shiftRepository.findOne({shiftId})
        .then(s => !shiftEntity ? s : !!s && shiftEntity.shiftId === s.shiftId ? s : null)
        
        if (!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
        
        const editedShift = await Object.assign(shift, { state: shiftState.Finalized })

        return await this.shiftRepository.save(editedShift);
    }

    async  getShiftWithPagination(shiftPagination: ShiftPaginationDTO) {
        const skip =  shiftPagination.limit*(shiftPagination.page -1);

        const paginatedShift = await this.shiftRepository
            .createQueryBuilder("shift")
            .leftJoinAndSelect("shift.guards", "guard")
            .skip(skip)
            .take(shiftPagination.limit)
            .getMany();

        if (!paginatedShift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shifts does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
        return paginatedShift
    }

    async statusChange() {
        let date = new Date()
        console.log(date)
        return await date
    }
}
