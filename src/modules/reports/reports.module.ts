import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { Report } from 'src/entities';
import { ShiftsModule } from '../shifts/shifts.module';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([Report]),
    ShiftsModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService, AppGateway]
})
export class ReportsModule {}
