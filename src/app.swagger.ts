import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const initSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HigSecurity API')
    .addBearerAuth()
    .setDescription(
      'Esta es una API Creada con NestJS con controlaladores principales para HigSecurity.',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
      explorer: true,
      swaggerOptions: {
          filter:true,
          showRequestDuration: true
      }
  });
};