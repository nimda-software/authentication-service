import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Column } from '/common/decorators/column.decorator';
import { CreateDateColumn } from '/common/decorators/create-date-column.decorator';
import { UpdateDateColumn } from '/common/decorators/update-date-column.decorator';
import { RoleStatus } from '/src/users/user.type';
import { RoleMapping } from '/src/users/entities/role-mapping.entity';

@Entity({ name: 'Roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 16, default: RoleStatus.OPEN })
  status: RoleStatus;

  @OneToMany(() => RoleMapping, (role) => role.user)
  roles: RoleMapping[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
