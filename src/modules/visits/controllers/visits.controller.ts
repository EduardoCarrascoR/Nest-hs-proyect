import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, User } from 'src/common/decorators';
import { AppResources } from 'src/common/enums';
import { User as UserEntity } from 'src/entities';
import { CreateVisitDTO } from '../dtos/visits';
import { VisitsService } from '../services/visits.service';

@ApiTags('Visits')
@Controller('visits')
export class VisitsController {
    constructor(
        private readonly visitService: VisitsService
    ){}

    @Auth({
        possession: 'own',
        action: 'create',
        resource: AppResources.VISIT,
    })
    @Post()
    async createReport(@Body() visitDTO: CreateVisitDTO, @User() user: UserEntity, @Res() res) {
        const visit = await this.visitService.addVisit(visitDTO, user);

        return await res.status(HttpStatus.CREATED).json({ success: true, message: 'Visit created', visit })
    }

    @Auth({
        possession: 'own',
        action: 'create',
        resource: AppResources.VISIT,
    })
    @Get('/allVisit/:idShift')
    async getVisit(@Param('idShift') shiftId: number, @Res() res, @User() user: UserEntity) {
        const visits = await this.visitService.findVisitsShift(shiftId, user)
        if(visits.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Visits not found" }, HttpStatus.NOT_FOUND)
        
        return await res.status(HttpStatus.OK).json({ success: true, message: 'Visits assingned', visits })
    }
}
