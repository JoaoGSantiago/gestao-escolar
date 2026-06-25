import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Todas as rotas ficam sob /api
  app.setGlobalPrefix('api');

  // Validação global rigorosa baseada nos DTOs (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades não declaradas no DTO
      forbidNonWhitelisted: true, // rejeita payloads com campos extras
      transform: true, // converte tipos primitivos automaticamente
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Padroniza o formato das respostas de erro
  app.useGlobalFilters(new HttpExceptionFilter());

  // Libera o frontend Next.js a consumir a API
  app.enableCors({
    origin: config.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  const port = config.get<number>('PORT', 3333);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 API EduGestao rodando em http://localhost:${port}/api`);
}

bootstrap();
