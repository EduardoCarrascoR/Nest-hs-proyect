import { NestFactory, APP_FILTER } from '@nestjs/core';
import { AppModule } from './app.module';
import "dotenv/config";
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { initSwagger } from './app.swagger';
import { PORT } from './config/constants';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const config = app.get(ConfigService);
  const port = Number(config.get<string>(PORT)) || 3000;
  

  app.setGlobalPrefix('api');

  initSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  logger.log(`Server is running in ${ await app.getUrl() }`)

}
bootstrap();
