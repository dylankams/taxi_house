import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne  } from 'typeorm';
import { Role } from './role.entity';
import { Driver } from '../../drivers/entities/driver.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => Driver, driver => driver.user)
  driver: Driver; // Ajoutez cette relation

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, role => role.users)
  role: Role;
}
