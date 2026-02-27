import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Ativa a validação automática para os teus DTOs
  app.useGlobalPipes(new ValidationPipe());

  // 2. Configura o CORS para o Vercel e outros ambientes
  app.enableCors({
    origin: '*', // Em produção, podes trocar pela URL do teu Frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Usa a porta do Render ou a 3002 (para não chocar com a 3001 do Core)
  const port = process.env.PORT || 3002;

  await app.listen(port);
  console.log(`🚀 Live Service running on: http://localhost:${port}`);
  console.log(`📡 WebSocket Signaling active`);
}
bootstrap();
