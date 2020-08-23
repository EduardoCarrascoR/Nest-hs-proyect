import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userProviders } from "./providers/user.providers";
import { databaseProviders } from 'src/db/database.provider';
import { databaseModule } from 'src/db/database.module';

@Module({
  imports: [databaseModule],
  controllers: [ UsersController],
  providers: [...userProviders,UsersService],
  exports: [UsersService]
})
export class UsersModule {}
