import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Taxi } from '../../taxis/entities/taxi.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Breakdown {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  breakdownType: string;

  @Column()
  description: string;

  @ManyToOne(() => Taxi, taxi => taxi.breakdowns)
  taxi: Taxi;

  @ManyToOne(() => Driver, driver => driver.breakdowns)
  driver: Driver;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: 'non traité' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
