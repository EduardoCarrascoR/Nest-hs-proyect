import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/';
import { EditUserDto } from 'src/modules/users/dtos';
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
        if(clientInDB) throw new HttpException('Client already exists, please verify the data', HttpStatus.BAD_REQUEST);
        
        const client: Client = await this.clientRepository.create({
            email,
            ...rest
        });

        await this.clientRepository.save(client);

        return client;
    }

    async findAllClients(): Promise<ClientDTO[]> {
        return this.clientRepository.find()
    }

    async findOneClient(id: number, clientEntity?: Client) {
        const client = await this.clientRepository.findOne(id)
        .then(c => !clientEntity ? c : !!c && clientEntity.id === c.id ? c : null)

        if (!client) throw new NotFoundException('Client does not exists or unauthorized')

        return client;
    }

    async updateClient(id: number, newValue: EditUserDto, clienEntity?: Client) {
        const client = await this.findOneClient(id, clienEntity);
        const editedClient = await Object.assign(client, newValue)
        return await this.clientRepository.save(editedClient)
    }
}
