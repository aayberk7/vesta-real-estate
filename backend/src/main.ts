import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ayarları (Frontend'in bağlanabilmesi için)
  app.enableCors({
    origin: [
      'http://localhost:5173', // Local development
      'https://vesta-real-estate.vercel.app', // Production (Vercel URL'ini değiştir)
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend çalışıyor: http://localhost:${port}`);
}
bootstrap();