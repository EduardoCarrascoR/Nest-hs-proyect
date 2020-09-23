import { Module } from '@nestjs/common';
import { ClientsService } from './services/clients.service';
import { ClientsController } from './controllers/clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities';


@Module({
  imports: [
    TypeOrmModule.forFeature([Client])
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
