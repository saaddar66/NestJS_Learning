// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Ensure this is imported
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // <-- 'app' is defined here
  app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true 
  })); 
  await app.listen(3000);
}
bootstrap(); // <-- Don't forget to call the function