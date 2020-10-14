import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { shiftState } from '../../../common/enums';
import { Shift } from '../../../entities';
import { CreateShiftDTO, ShiftDTO } from '../dtos/shift.dto';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
            private readonly shiftRepository: Repository<Shift>
    ) {}

    async findAllShift(): Promise<ShiftDTO[]> {
        const shifts = await this.shiftRepository.find({ relations: ["guards"] })
        return shifts;
    }

    async addShift( shiftDTO: CreateShiftDTO) {
        const { guards, ...rest } = shiftDTO
        const shift: Shift = await this.shiftRepository.create({
            guards: guards,
            ...rest
            
        })
        await this.shiftRepository.save(shift)
        return shift;
    }

    async shiftInicialized(id: number, shiftEntity?: Shift) {
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

    async statusChange() {
        let date = new Date()
        console.log(date)
        return await date
    }
}
