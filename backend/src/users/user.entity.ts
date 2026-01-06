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
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column('text', { nullable: true }) // nvarchar(max) yerine text
  profileImage: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Listing, (listing) => listing.owner, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  listings: Listing[];

  @OneToMany(() => Listing, (listing) => listing.agent)
  agentListings: Listing[];
}