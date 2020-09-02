import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { GetUserMiddleware } from './middlewares/get-user.middleware';
import { UsersController } from './modules/users/controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [  TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_DB,
      entities: [__dirname + './**/**/*entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      logger: 'file',
    }),
  }),   
   AuthModule, UsersModule, ],
  controllers: [],
  providers: [],
})
export class AppModule  implements NestModule {
  
  configure(consumer: MiddlewareConsumer): void {

    consumer
      .apply(GetUserMiddleware)
      .forRoutes(
        UsersController
      )

  } 
}
