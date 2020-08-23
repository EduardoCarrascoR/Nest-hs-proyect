import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { GetUserMiddleware } from './middlewares/get-user.middleware';
import { UsersController } from './modules/users/controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entity/user.entity';
import { databaseModule } from './db/database.module';

@Module({
  imports: [UsersModule, AuthModule, databaseModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer): void {

    consumer
      .apply(GetUserMiddleware)
      .forRoutes(
        UsersController
      )

  }
}
