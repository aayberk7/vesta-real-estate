import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  // Kullanıcının tüm favorilerini getir
  async findByUser(userId: number) {
    return this.favoriteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Favoriye ekle
  async addFavorite(userId: number, listingId: number) {
    // Zaten favoride mi kontrol et
    const existing = await this.favoriteRepository.findOne({
      where: { userId, listingId },
    });

    if (existing) {
      throw new BadRequestException('Bu ilan zaten favorilerinizde');
    }

    const favorite = this.favoriteRepository.create({ userId, listingId });
    return this.favoriteRepository.save(favorite);
  }

  // Favoriden çıkar
  async removeFavorite(userId: number, listingId: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, listingId },
    });

    if (!favorite) {
      throw new NotFoundException('Bu ilan favorilerinizde değil');
    }

    await this.favoriteRepository.remove(favorite);
    return { message: 'Favorilerden çıkarıldı' };
  }

  // Bir ilanın favoride olup olmadığını kontrol et
  async isFavorite(userId: number, listingId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, listingId },
    });
    return !!favorite;
  }
}