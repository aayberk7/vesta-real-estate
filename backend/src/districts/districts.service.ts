import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from './district.entity';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private districtRepo: Repository<District>,
  ) {}

  findAll() {
    return this.districtRepo.find();
  }

  create(name: string) {
    const district = this.districtRepo.create({ name });
    return this.districtRepo.save(district);
  }
}
