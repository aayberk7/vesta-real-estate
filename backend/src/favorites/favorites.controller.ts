import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard) // Tüm endpointler giriş gerektirir
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  // Kullanıcının favorilerini getir
  @Get()
  getMyFavorites(@Req() req) {
    return this.favoritesService.findByUser(req.user.userId);
  }

  // Favoriye ekle
  @Post(':listingId')
  addFavorite(@Req() req, @Param('listingId') listingId: string) {
    return this.favoritesService.addFavorite(req.user.userId, +listingId);
  }

  // Favoriden çıkar
  @Delete(':listingId')
  removeFavorite(@Req() req, @Param('listingId') listingId: string) {
    return this.favoritesService.removeFavorite(req.user.userId, +listingId);
  }

  // İlanın favoride olup olmadığını kontrol et
  @Get('check/:listingId')
  async checkFavorite(@Req() req, @Param('listingId') listingId: string) {
    const isFavorite = await this.favoritesService.isFavorite(
      req.user.userId,
      +listingId,
    );
    return { isFavorite };
  }
}