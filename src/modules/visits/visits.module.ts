import { Module } from '@nestjs/common';
import { VisitsService } from './services/visits.service';
import { VisitsController } from './controllers/visits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from 'src/entities';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([Visit]),
    UsersModule
  ],
  providers: [VisitsService],
  controllers: [VisitsController]
})
export class VisitsModule {}
