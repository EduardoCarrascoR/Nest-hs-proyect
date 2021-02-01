import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AccessControlModule } from "nest-access-control";
import { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASS, DATABASE_DB } from './config/constants';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { Shift, Client, User, Report, News, Workedhours, Visit, GuardsLocation } from './entities'
import { roles } from './app.roles';
import { ReportsModule } from './modules/reports/reports.module';
import { NewsModule } from './modules/news/news.module';
import { VisitsModule } from './modules/visits/visits.module';
import { PdfService } from './pdf/pdf.service';

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
        entities: [ Shift, Client, User, Report, News, Workedhours, Visit, GuardsLocation ],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        logger: 'file',
        connectTimeout: 10000,
        ETIMEDOUT: 20 * 10000
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AccessControlModule.forRoles(roles), AuthModule, UsersModule, ClientsModule, ShiftsModule, ReportsModule, NewsModule, VisitsModule ],
  controllers: [],
  providers: [PdfService],
})
export class AppModule {
  
}
