import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { GetUserMiddleware } from './middlewares/get-user.middleware';
import { UsersController } from './modules/users/controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASS, DATABASE_DB } from './config/constants';

@Module({
  imports: [  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'mysql',
      host: config.get<string>(DATABASE_HOST),
      port: Number(config.get<string>(DATABASE_PORT)),
      username: config.get<string>(DATABASE_USER),
      password: config.get<string>(DATABASE_PASS),
      database: config.get<string>(DATABASE_DB),
      entities: [__dirname + './**/**/*entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      logger: 'file',
    }),
  }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
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
