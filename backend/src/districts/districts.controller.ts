import { Controller, Get, Post, Body } from '@nestjs/common';
import { DistrictsService } from './districts.service';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  getAll() {
    return this.districtsService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.districtsService.create(name);
  }
}
