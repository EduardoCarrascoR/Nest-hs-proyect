import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Auth } from '../../../common/decorators';
import { AppResources } from '../../../common/enums';
import { CreateShiftDTO, ShiftDTO } from '../dtos/shift.dto';
import { ShiftsService } from '../services/shifts.service';

@Controller('shifts')
export class ShiftsController {
    constructor(
        private readonly shiftService: ShiftsService
    ) {}

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResources.SHIFT,
    })
    @Post()
    async createShift(@Body() shiftDTO: CreateShiftDTO, @Res() res) {
        const success = await this.shiftService.addShift(shiftDTO);

        return await res.status(HttpStatus.CREATED).json({ success: success, message: 'Shift created' })
    }

    @Auth({
        possession: 'any',
        action: 'read',
        resource: AppResources.SHIFT,
    })
    @Get('/all')
    async getShifts(@Res() res) {
        const shifts = await this.shiftService.findAllShift();
        if(shifts.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Shifts not found" }, HttpStatus.NOT_FOUND)
        return res.status(HttpStatus.OK).json({ success: true, shifts: shifts })
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResources.SHIFT,
    })
    @Put('init/:id')
    async Initialized(@Param('id') id: number, @Res() res) {
        if(!id) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Can't initialized shift id" }, HttpStatus.BAD_REQUEST)
        const shift = await this.shiftService.shiftInicialized(id);
        
        return res.status(HttpStatus.OK).json({ success: true, message: 'Shift initialized', shift })
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResources.SHIFT,
    })
    @Put('final/:id')
    async Finalized(@Param('id') id: number, @Res() res) {
        if(!id) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Can't initialized shift id" }, HttpStatus.BAD_REQUEST)
        const shift = await this.shiftService.shiftFinalized(id);
        
        return res.status(HttpStatus.OK).json({ success: true, message: 'Shift finalized', shift })
    }
}
