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
      'https://vesta-real-estate-kt8p.vercel.app', // Production - Senin URL'in
      'https://vesta-real-estate-kt8p-f6oz8v9d4-ayberks-projects-aaf4ebca.vercel.app', // Preview URL
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