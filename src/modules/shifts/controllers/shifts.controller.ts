import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { response } from 'express';
import { CreateShiftDTO, ShiftDTO } from '../dtos/shift.dto';
import { ShiftsService } from '../services/shifts.service';

@Controller('shifts')
export class ShiftsController {
    constructor(
        private readonly shiftService: ShiftsService
    ) {}

    @Post()
    async createShift(@Body() shiftDTO: CreateShiftDTO, @Res() res) {
        const shift = this.shiftService.addShift(shiftDTO);

        return res.status(HttpStatus.CREATED).json({ success: true, message: 'User created', shift })
    }

    @Get('/all')
    async getShifts(@Res() res) {
        const shifts = this.shiftService.findAllShift();
        
        return res.status(HttpStatus.OK).json({ success: true, shifts: shifts })
    }

    @Put('init/:id')
    async Initialized(@Param('id') id: number, @Res() res) {
        if(!id) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Can't initialized shift id" }, HttpStatus.BAD_REQUEST)
        const shift = this.shiftService.shiftInicialized(id);
        
        return res.status(HttpStatus.OK).json({ success: true, message: 'Shift initialized', shift })
    }

    @Put('final/:id')
    async Finalized(@Param('id') id: number, @Res() res) {
        if(!id) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Can't initialized shift id" }, HttpStatus.BAD_REQUEST)
        const shift = this.shiftService.shiftFinalized(id);
        
        return res.status(HttpStatus.OK).json({ success: true, message: 'Shift finalized', shift })
    }
}
