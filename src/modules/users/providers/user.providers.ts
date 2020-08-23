import { Connection, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UsersService } from '../services/users.service';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DATABASE_CONNECTION'],
  },
];