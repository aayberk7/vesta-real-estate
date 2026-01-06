import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
  ) {}

  
  //register fonksiyonu
  async register(dto: RegisterDto, photoFilename?: string) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Bu email zaten kayıtlı');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: dto.role as UserRole,
      profileImage: photoFilename
      ? `/uploads/profiles/${photoFilename}`
      : null,
    });

    return {
      message: 'Kayıt başarılı',
      userId: user.id,
    };
  }

  //login fonksiyonu
  async login(dto: LoginDto) {
  const user = await this.usersService.findByEmail(dto.email);

  if (!user) {
    throw new UnauthorizedException('Email veya şifre hatalı');
  }

  const passwordMatch = await bcrypt.compare(dto.password, user.password);

  if (!passwordMatch) {
    throw new UnauthorizedException('Email veya şifre hatalı');
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const token = this.jwtService.sign(payload);

  return {
    accessToken: token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  };
}

}
