import { Module } from '@nestjs/common';
import { ShiftsService } from './services/shifts.service';
import { ShiftsController } from './controllers/shifts.controller';
import { Shift } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift]),
    UsersModule
  ],
  providers: [ShiftsService],
  controllers: [ShiftsController],
  exports: [ShiftsService]
})
export class ShiftsModule {}
