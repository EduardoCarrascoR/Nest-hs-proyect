
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
dotenv.config()

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
      ],
      synchronize: true,
    }).then(() => {
        console.log(`database conected.`)
    })   
    .catch(err => {
        console.log('No se pudo conectar con la base de datos.')
        console.log(err)
    }),
  },
];
