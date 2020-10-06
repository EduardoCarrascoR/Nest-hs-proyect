import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/';
import { EditUserDto } from 'src/modules/users/dtos/edit-user.dto';
import { Repository } from 'typeorm';
import { ClientDTO } from '../dtos/client.dto';

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
}
