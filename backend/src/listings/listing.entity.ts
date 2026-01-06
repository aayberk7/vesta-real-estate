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

  @Column({ type: 'nvarchar', length: 'max' })
  description: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  commission: number; // 👈 YENİ: Komisyon (fiyatın %3'ü)

  @Column()
  address: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: ListingStatus.ACTIVE,
  })
  status: ListingStatus;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  image: string | null;

  @ManyToOne(() => User, { eager: true }) 
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, { eager: true, nullable: true , onDelete: 'SET NULL' })
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