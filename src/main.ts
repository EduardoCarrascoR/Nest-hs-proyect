import { NestFactory, APP_FILTER } from '@nestjs/core';
import { AppModule } from './app.module';
import "dotenv/config";
import { Logger, ValidationPipe } from '@nestjs/common';
import { initSwagger } from './app.swagger';
import { PORT } from './config/constants';
import { ConfigService } from '@nestjs/config';
import { setDefaultUser } from './config/default-user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
});
  const logger = new Logger();
  const config = app.get(ConfigService);
  const port = Number(config.get<string>(PORT)) || 3000;
  

  app.setGlobalPrefix('api');

  initSwagger(app);
  setDefaultUser(config);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  logger.log(`Server is running in ${ await app.getUrl() }`)

}
bootstrap();
