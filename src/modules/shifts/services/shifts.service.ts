import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { shiftState } from 'src/common/enums';
import { Shift } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateShiftDTO, ShiftDTO } from '../dtos/shift.dto';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
            private readonly shiftRepository: Repository<Shift>
    ) {}

    async findAllShift(): Promise<ShiftDTO[]> {
        const shifts = await this.shiftRepository.find()
        return shifts;
    }

    async addShift( shiftDTO: CreateShiftDTO) {
        const { guards, ...rest } = shiftDTO
        const shiftUser = await this.shiftRepository.create({
            users: guards,
            ...rest
            
        })
    }

    async shiftInicialized(id: number, shiftEntity?: Shift) {
        const shift = await this.shiftRepository.findOneOrFail()
        .then(s => !shiftEntity ? s : !!s && shiftEntity.shiftId === s.shiftId ? s : null)

        if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)
    
        const editedShift = await Object.assign(shift, { state: shiftState.Initialized })

        return await this.shiftRepository.save(editedShift);
    }

    async shiftFinalized(shiftId: number, shiftEntity?: Shift) {
        console.log(shiftState.Finalized, this.statusChange)
        const shift = await this.shiftRepository.findOne({shiftId})
        .then(s => !shiftEntity ? s : !!s && shiftEntity.shiftId === s.shiftId ? s : null)
        .catch( s => s = null)
        
        await console.log(shift, shiftState.Finalized,await this.statusChange())
        if (!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'User does not exists or unauthorized'}, HttpStatus.NOT_FOUND)
        /*if(!shift) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: 'Shift does not exists or unauthorized'},HttpStatus.NOT_FOUND)
        
        const editedShift = await Object.assign(shift, { state: shiftState.Initialized, start: this.statusChange })
        */
        let date = new Date().getTime()
        console.log(date)
        return {status: 'funciono'}/* await this.shiftRepository.save(editedShift) */;
    }

    async statusChange() {
        let date = new Date()
        console.log(date)
        return await date
    }
}
