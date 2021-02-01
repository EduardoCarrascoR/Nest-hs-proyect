import { Module } from '@nestjs/common';
import { ShiftsService } from './services/shifts.service';
import { ShiftsController } from './controllers/shifts.controller';
import { GuardsLocation, Shift } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift, GuardsLocation]),
    UsersModule
  ],
  providers: [ShiftsService, PdfService],
  controllers: [ShiftsController],
  exports: [ShiftsService]
})
export class ShiftsModule {}
