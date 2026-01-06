import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './districts/district.entity';
import { Category } from './categories/category.entity';
import { User } from './users/user.entity';
import { Listing } from './listings/listing.entity';
import { Favorite } from './favorites/favorite.entity'; // 👈 EKLE
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
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa', 
      password: 'Sa.123456789!',
      database: 'vesta_db',
      entities: [District, Category, User, Listing, Favorite], // 👈 Favorite EKLE
      synchronize: true,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
      connectionTimeout: 30000,
      requestTimeout: 30000,
      extra: {
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000
        }
      }
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