import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { District } from './districts/district.entity';
import { Category } from './categories/category.entity';
import { User } from './users/user.entity';
import { Listing } from './listings/listing.entity';
import { Favorite } from './favorites/favorite.entity';
import { DistrictsModule } from './districts/districts.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env dosyasını her yerde kullan
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // MSSQL yerine PostgreSQL
      url: process.env.DATABASE_URL, // Neon connection string
      entities: [District, Category, User, Listing, Favorite],
      synchronize: true, // Production'da false olmalı ama şimdilik true
      ssl: {
        rejectUnauthorized: false, // Neon için gerekli
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    DistrictsModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    ListingsModule,
    FavoritesModule,
  ],
})
export class AppModule {}