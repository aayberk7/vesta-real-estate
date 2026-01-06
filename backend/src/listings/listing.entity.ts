import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { District } from '../districts/district.entity';

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text') // PostgreSQL için 'text' kullan
  description: string;

  @Column('decimal', { precision: 10, scale: 2 }) // precision düşürüldü
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  commission: number;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.ACTIVE,
  })
  status: ListingStatus;

  @Column('text', { nullable: true }) // text olarak değişti
  image: string | null;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'agentId' })
  agent: User | null;

  @Column({ nullable: true })
  agentId: number | null;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @ManyToOne(() => District, { eager: true })
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column()
  districtId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}