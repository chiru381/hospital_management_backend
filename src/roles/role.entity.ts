import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('role_master')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  rolename: string;

  @Column({ default: true })
  isactive: boolean;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, user => user.role)
  users: User[];
}