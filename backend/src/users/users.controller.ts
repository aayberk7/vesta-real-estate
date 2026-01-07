import { Controller, Get, Put, Body, UseGuards, Req ,UseInterceptors,     // <-- Bunu ekle
  UploadedFile ,Delete} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express'; // <-- Bunu ekle
import { diskStorage } from 'multer';                      // <-- Bunu ekle
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    console.log('REQ.USER =>', req.user);
    return this.usersService.findOne(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  @UseInterceptors(FileInterceptor('photo', {
  storage: diskStorage({
    destination: './uploads/profiles',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
}))
  async updateMe(@Req() req, @Body() body, @UploadedFile() file: Express.Multer.File) {
  if (file) {
    body.profileImage = `/uploads/profiles/${file.filename}`;
  }
  return this.usersService.update(req.user.userId, body);
}

@UseGuards(JwtAuthGuard)
@Delete('me')
async deleteMe(@Req() req) {
  return this.usersService.delete(req.user.userId);
}


@UseGuards(JwtAuthGuard)
@Put('change-password')
async changePassword(@Req() req, @Body() body: { oldPassword: string; newPassword: string }) {
  return this.usersService.changePassword(req.user.userId, body.oldPassword, body.newPassword);
}


// Tüm emlakçıları listele
@Get('agents')
async getAgents() {
  return this.usersService.findByRole('AGENT');
}
}
