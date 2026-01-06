import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListingsService } from './listings.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  // Tüm ilanları getir (giriş yapmadan da görebilir)
  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  // Tek ilan detay
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(+id);
  }

  // Kullanıcının kendi ilanları (giriş yapmış olmalı)
  @UseGuards(JwtAuthGuard)
  @Get('my/listings')
  myListings(@Req() req) {
    return this.listingsService.findByOwner(req.user.userId);
  }

  // Yeni ilan oluştur (giriş yapmış olmalı)
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/listings',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Req() req,
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      body.image = `/uploads/listings/${file.filename}`;
    }
    body.ownerId = req.user.userId;
    return this.listingsService.create(body);
  }

  // İlan güncelle (sadece sahibi güncelleyebilir)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/listings',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      body.image = `/uploads/listings/${file.filename}`;
    }
    return this.listingsService.update(+id, body);
  }

  // İlan sil (sadece sahibi silebilir)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.listingsService.delete(+id);
  }




  // Emlakçının ilanlarını getir (komisyonlar için)
@UseGuards(JwtAuthGuard)
@Get('agent/my-commissions')
myCommissions(@Req() req) {
  return this.listingsService.findByAgent(req.user.userId);
}
}