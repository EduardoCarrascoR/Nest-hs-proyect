import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators';
import { AppResources } from 'src/common/enums';
import { ClientDTO, EditClientDto } from '../dtos/';
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
        return res.status(HttpStatus.OK).json({ success: true, clients: clients })
    }

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResources.CLIENT,
    })
    @Post()
    async createClient(@Body() clientDTO: ClientDTO) {
        const client = await this.clientService.addClient(clientDTO);
        return { success: true, message: 'Client created', client };
    }

    @Auth({
        possession: 'any',
        action: 'update',
        resource: AppResources.CLIENT,
    })
    @Put(':id')
    async updateClient(@Param('id') id: number, @Body() changes: EditClientDto) {
        
        if(!id) throw new BadRequestException("Can't update user id")
        const client = await this.clientService.updateClient(id, changes)

        return { success: true, message: 'Client edited', client }
    }

}
