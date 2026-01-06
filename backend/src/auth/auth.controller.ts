import { Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
@UseInterceptors(
  FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, cb) => {
        const uniqueName =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + extname(file.originalname));
      },
    }),
  }),
)
register(
  @Body() dto: RegisterDto,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.authService.register(dto, file?.filename);
}
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
}



}
