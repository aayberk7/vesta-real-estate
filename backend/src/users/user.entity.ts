import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Listing } from '../listings/listing.entity';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  AGENT = 'AGENT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar', 
    length: 20, 
    default: UserRole.CUSTOMER
  })
  role: UserRole;
  
  @Column({
    type: 'nvarchar', // MSSQL için string karşılığı
    length: 'max',    // Veya istediğin bir uzunluk, örn: 500
    nullable: true })
  profileImage: string|null;

  @CreateDateColumn()
  createdAt: Date;


  // İlişki: Kullanıcının sahibi olduğu ilanlar
  @OneToMany(() => Listing, (listing) => listing.owner, { 
    cascade: true,
    onDelete: 'CASCADE' 
  })
  listings: Listing[];

  // İlişki: Emlakçı olarak atandığı ilanlar
  @OneToMany(() => Listing, (listing) => listing.agent)
  agentListings: Listing[];
  
  
}
