import { Entity, ManyToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column, UpdateDateColumn, CreateDateColumn } from '../../__common/decorators';
import { RoleStatus } from '../user.type';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.OPEN })
  status: RoleStatus;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
