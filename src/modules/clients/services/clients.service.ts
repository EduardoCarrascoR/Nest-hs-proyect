import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Client, Report, Shift, User } from '../../../entities';
import { EditUserDto } from '../../users/dtos';
import { ClientDTO, ReportClientDTO } from '../dtos/client.dto';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>
    ) {}

    async addClient( clientDTO: ClientDTO): Promise<ClientDTO> {
        const { email, ...rest } = clientDTO;
        const clientInDB = await this.clientRepository.findOne({
            where: { email }
        });
        if(clientInDB) throw new HttpException({ success: false, status: HttpStatus.BAD_REQUEST, message:'Client already exists, please verify the data'}, HttpStatus.BAD_REQUEST);
        
        const client: Client = await this.clientRepository.create({
            email,
            ...rest
        });
        
        await this.clientRepository.save(client);
        
        return client;
    }
    
    async findAllClients(): Promise<ClientDTO[]> {
        const clients = await this.clientRepository.find()
        return clients
    }

    
    async findOneClient(id: number, clientEntity?: Client) {
        const client = await this.clientRepository.findOne(id)
        .then(c => !clientEntity ? c : !!c && clientEntity.clientId === c.clientId ? c : null)
        
        if (!client) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message:'Client does not exists or unauthorized'}, HttpStatus.NOT_FOUND);
        
        return client;
    }
    
    async updateClient(id: number, newValue: EditUserDto, clientEntity?: Client) {
        const client = await this.findOneClient(id, clientEntity)
        .then(c => !clientEntity ? c : !!c && clientEntity.clientId === c.clientId ? c : null)
        
        if (!client) throw new HttpException({ success: false, status: HttpStatus.NOT_FOUND, message:'Client does not exists or unauthorized'}, HttpStatus.NOT_FOUND);
        
        const editedClient = await Object.assign(client, newValue)
        return await this.clientRepository.save(editedClient)
    }

    async findAllreportClient(clientId, date){
        let reports/* , reportMEJORADO */; 
        await getConnection().transaction(async transaction => {
            reports = transaction
                .queryRunner
                .query(`select client.client_id, concat(user.firstname, ' ', user.lastname) as 'guard', shift.date, report.time, shift.shift_place as 'place', report.type from client 
            inner join report
            on client.client_id=report.shift_client_client_id
            inner join shift
            on report.shift_shift_id=shift.shift_id
            inner join user
            on report.shift_guard_id=user.user_id
            where shift.date="${date}" and shift.client_client_id="${clientId}"
            order by user.user_id, report.time DESC`)

            /* reportMEJORADO = await transaction
                .createQueryBuilder()
                .select(`client.client_id`)
                .addSelect(`concat(user.firstname, ' ', user.lastname)`)
                .addSelect(`shift.date`)
                .addSelect(`report.time`)
                .addSelect(`shift.shift_place`)
                .addSelect(`report.type`)
                .from(Client,"client")
                .innerJoin(Report, "report", "client.client_id=report.shift_client_client_id")
                .innerJoin(Shift, "shift", "report.shift_shift_id=shift.shift_id")
                .innerJoin(User, "user", "report.shift_guard_id=user.user_id")
                .where("shift.date=:date", { date })
                .andWhere("shift.client_client_id=:clientId", {clientId})
                .getMany()
                 */
                if(!reports) throw new HttpException({ success: true, status: HttpStatus.NOT_FOUND, message: "Reports not found", reports }, HttpStatus.NOT_FOUND)
                
                /* console.log(reportMEJORADO) */
            })

        return reports
    }
}
