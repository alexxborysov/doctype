import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './kernel/app.module';
import { HttpExceptionFilter } from './kernel/filters/http-exceptions.filter';
import { PrismaClientExceptionFilter } from './kernel/filters/prisma-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [process.env.FRONTEND_APP_URL];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.use(helmet());
  console.log('Allowed Origins: ', allowedOrigins);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  app.use(cookieParser());

  await app.listen(process.env.BACKEND_PORT || 3001);
}

bootstrap();
