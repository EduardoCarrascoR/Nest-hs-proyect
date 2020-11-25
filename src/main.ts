import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './app.swagger';
import { AppModule } from './app.module';
import { PORT } from './config/constants';
import { setDefaultUser } from './config/default-user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
});
  const logger = new Logger('NestApplication');
  const config = app.get(ConfigService);
  const port = Number(config.get<string>(PORT)) || 3000;
  

  app.setGlobalPrefix('api');

  initSwagger(app);
  setDefaultUser(config);
  app.useGlobalPipes(new ValidationPipe());
  const server =await app.listen(port, () => {

    logger.log(`Server is running in ${ server.address().port }`)
  });

}
bootstrap();
