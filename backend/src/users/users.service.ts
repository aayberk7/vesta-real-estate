import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User ,UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  findOne(userId: number) {
  return this.userRepository.findOne({
    where: { id: userId },
    select: ['id', 'username', 'email', 'role', 'profileImage','createdAt'],
  });
}
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
    
  async update(userId: number, data: Partial<User>) {
    await this.userRepository.update(userId, data);
    return this.findOne(userId);
  }


  async delete(userId: number) {
  await this.userRepository.delete(userId);
  return { message: 'Hesap başarıyla silindi' };
  }



  async changePassword(userId: number, oldPassword: string, newPassword: string) {
  // Kullanıcıyı şifresiyle birlikte getir
  const user = await this.userRepository.findOne({ 
    where: { id: userId },
    select: ['id', 'password'] 
  });

  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }

  // Eski şifre kontrolü
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Eski şifre yanlış');
  }

  // Yeni şifreyi hashle
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Güncelle
  await this.userRepository.update(userId, { password: hashedPassword });
  
  return { message: 'Şifre başarıyla değiştirildi' };
  
}

// Tüm emlakçıları getir
findByRole(role: string) {
  return this.userRepository.find({
    where: { role:UserRole.AGENT },
    select: ['id', 'username', 'email' , 'profileImage'],
  });
}
// Emlakçının kaç ilanı var?
async getAgentListingCount(agentId: number): Promise<number> {
  const agent = await this.userRepository.findOne({
    where: { id: agentId },
    relations: ['listings'],
  });
  return agent?.listings?.length || 0;
}

}
