import { NestFactory, APP_FILTER } from '@nestjs/core';
import { AppModule } from './app.module';
import "dotenv/config";
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { initSwagger } from './app.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  

  app.setGlobalPrefix('api');

  initSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
  logger.log(`Server is running in ${ await app.getUrl() }`)

}
bootstrap();
