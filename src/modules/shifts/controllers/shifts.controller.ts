import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User as UserEntity} from '../../../entities';
import { Auth, User } from '../../../common/decorators';
import { AppResources } from '../../../common/enums';
import { CreateShiftDTO, ShiftDTO, ShiftHoursWorkedDTO, ShiftPaginationDTO } from '../dtos/shift.dto';
import { ShiftsService } from '../services/shifts.service';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftsController {
    constructor(
        private readonly shiftService: ShiftsService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder
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
        return res.status(HttpStatus.FOUND).json({ success: true, shifts: shifts })
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResources.SHIFT,
    })
    @Get('/guardShifts/:id')
    async guardShifts( @User() user: UserEntity, @Res() res, @Param('id') guardId: number) {
        let shifts;
        if(this.rolesBuilder
            .can(user.roles)
            .updateAny(AppResources.SHIFT)
            .granted
        ) {
            //es Admin
            shifts = await this.shiftService.findAssignedShiftsGuard(undefined,guardId)
        } else {
            // es Guard
            shifts = await this.shiftService.findAssignedShiftsGuard(user)
        }
        if(shifts.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Shifts not found" }, HttpStatus.NOT_FOUND)
        return res.status(HttpStatus.OK).json({ success: true, message: 'Shifts assingned', shifts })
    }
        
    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResources.SHIFT,
    })
    @Put('init/:id/:idClient')
    async Initialized(@Param('id') id: number,@Param('idClient') idClient: number, @User() user: UserEntity, @Res() res) {
        let shift;
        if(!id) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Can't initialized shift id" }, HttpStatus.BAD_REQUEST)
       
        shift = await this.shiftService.shiftInicialized(id, idClient, user)
        return res.status(HttpStatus.OK).json({ success: true, message: 'Shift initialized', shift })
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResources.SHIFT,
    })
    @Put('final/:id/:idClient')
    async Finalized(@Param('id') id: number, @Param('idClient') idClient: number, @User() user: UserEntity, @Res() res) {
        let shift;
        if(!id) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Can't initialized shift id" }, HttpStatus.BAD_REQUEST)

        shift = await this.shiftService.shiftFinalized(id, idClient, user)
        
        return res.status(HttpStatus.OK).json({ success: true, message: 'Shift finalized' })
    }


    @Auth({
        possession: 'any',
        action: 'read',
        resource: AppResources.SHIFT,
    })
    @Post('/pagiShift')
    async shiftPagination(@Body() paginationDTO: ShiftPaginationDTO, @Res() res) {
        const shifts = await this.shiftService.getShiftWithPagination(paginationDTO);
        if(!shifts) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Shifts not found" }, HttpStatus.NOT_FOUND)
        if(!shifts.pages) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Shifts count not found" }, HttpStatus.NOT_FOUND)
        if(shifts.paginatedShift.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Shifts data not found" }, HttpStatus.NOT_FOUND)
        
        return res.status(HttpStatus.ACCEPTED).json({ success: true, message: `Shifts page ${shifts.pageSelected}`, pages: shifts.pages, shifts: shifts.paginatedShift })
    }

}
