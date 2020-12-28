import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { validate } from 'class-validator';
import { DatePipePipe } from 'src/pipes/date-pipe.pipe';
import { Auth } from '../../../common/decorators';
import { AppResources } from '../../../common/enums';
import { ClientDTO, EditClientDto, ReportClientDTO } from '../dtos/';
import { ClientsService } from '../services/clients.service';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
    constructor(
        private readonly clientService: ClientsService
    ) {}

    @Auth({
        possession: 'any',
        action: 'read',
        resource: AppResources.CLIENT,
    })
    @Get('/all')
    async getClients(@Res() res) {
        const clients = await this.clientService.findAllClients();
        if(clients.length == 0) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message: "Clients not found" }, HttpStatus.NOT_FOUND)
        return res.status(HttpStatus.ACCEPTED).json({ success: true, clients: clients })
    }

    @Auth({
        possession: 'any',
        action: 'read',
        resource: AppResources.CLIENT,
    })
    @Get('/reportClient/:clientId/date/:date')
    async getReportsClient(@Param('clientId', ParseIntPipe) clientId: number, @Param('date', new DatePipePipe()) date: Date, @Res() res) {
        if(!clientId) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Client Id not joined." }, HttpStatus.BAD_REQUEST)
        if(!date) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message: "Date not joined." }, HttpStatus.BAD_REQUEST)

        const reports = await this.clientService.findAllreportClient(clientId,date);
        if(reports.length == 0) throw new HttpException({ success: true, status: HttpStatus.ACCEPTED, message: "Reports not found", reports }, HttpStatus.ACCEPTED)
        return res.status(HttpStatus.ACCEPTED).json({ success: true, reports: reports })
    }

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResources.CLIENT,
    })
    @Post()
    async createClient(@Body() clientDTO: ClientDTO, @Res() res) {
        const client = await this.clientService.addClient(clientDTO);
        return res.status(HttpStatus.CREATED).json({ success: true, message: 'Client created', client });
    }

    @Auth({
        possession: 'any',
        action: 'update',
        resource: AppResources.CLIENT,
    })
    @Put(':id')
    async updateClient(@Param('id') id: number, @Body() changes: EditClientDto, @Res() res) {
        
        if(!id) throw new BadRequestException("Can't update user id")
        const client = await this.clientService.updateClient(id, changes)

        return res.status(HttpStatus.OK).json({ success: true, message: 'Client edited', client })
    }

}
