import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from "nest-access-control";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASS, DATABASE_DB } from './config/constants';
import { roles } from './app.roles';

@Module({
  imports: [  
    TypeOrmModule.forRootAsync({
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
    AccessControlModule.forRoles(roles), AuthModule, UsersModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
