import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';
import { Client } from '../../entities';


@Module({
  imports: [
    TypeOrmModule.forFeature([Client])
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
