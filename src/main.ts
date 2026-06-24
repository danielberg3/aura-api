import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Medical News API')
    .setDescription(
      'API para gerenciamento de notícias relacionadas à saúde e medicina',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Application running on: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
  console.log(
    `Swagger available at: http://localhost:${process.env.PORT ?? 3000}/docs`,
  );
}

void bootstrap();
