import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './listing.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
    private usersService: UsersService, // 👈 EKLE
  ) {}

  // Tüm ilanları getir
  findAll() {
    return this.listingRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Tek ilan getir
  findOne(id: number) {
    return this.listingRepository.findOne({ where: { id } });
  }

  // Kullanıcının ilanlarını getir
  findByOwner(ownerId: number) {
    return this.listingRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  // Emlakçının atandığı ilanları getir
  findByAgent(agentId: number) {
    return this.listingRepository.find({
      where: { agentId },
      order: { createdAt: 'DESC' },
    });
  }

  // Yeni ilan oluştur
  async create(data: Partial<Listing>) {
    // Emlakçı seçildiyse kontrol et (max 5 ilan)
    if (data.agentId) {
      const agentListingCount = await this.listingRepository.count({
        where: { agentId: data.agentId },
      });

      if (agentListingCount >= 5) {
        throw new BadRequestException('Bu emlakçı maksimum 5 ilan limitine ulaştı');
      }
    }

    // Komisyonu hesapla (%3)
    if (data.price) {
      data.commission = Number(data.price) * 0.03;
    }

    const listing = this.listingRepository.create(data);
    return this.listingRepository.save(listing);
  }

  // İlan güncelle
  async update(id: number, data: Partial<Listing>) {
    // Fiyat değiştiyse komisyonu yeniden hesapla
    if (data.price) {
      data.commission = Number(data.price) * 0.03;
    }

    await this.listingRepository.update(id, data);
    return this.findOne(id);
  }

  // İlan sil
  async delete(id: number) {
    await this.listingRepository.delete(id);
    return { message: 'İlan başarıyla silindi' };
  }
}