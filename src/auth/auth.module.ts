import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersService } from 'src/modules/users/services/users.service';
import { User } from 'src/modules/users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userProviders } from 'src/modules/users/providers/user.providers';
import { databaseModule } from 'src/db/database.module';

@Module({
  imports: [ forwardRef(() => UsersModule),databaseModule],
  controllers: [AuthController],
  providers: [...userProviders,UsersService],
})

export class AuthModule {}
