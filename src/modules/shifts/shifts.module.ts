import { Module } from '@nestjs/common';
import { ShiftsService } from './services/shifts.service';
import { ShiftsController } from './controllers/shifts.controller';
import { Shift } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift])
  ],
  providers: [ShiftsService],
  controllers: [ShiftsController]
})
export class ShiftsModule {}
