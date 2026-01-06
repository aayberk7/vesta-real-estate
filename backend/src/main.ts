import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ayarları - Frontend'in bağlanabilmesi için
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite default port
      'http://localhost:5174', // Senin port'un
      'http://localhost:3001',
      'https://vesta-real-estate.vercel.app', // Production
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend çalışıyor: http://localhost:${port}`);
}
bootstrap();