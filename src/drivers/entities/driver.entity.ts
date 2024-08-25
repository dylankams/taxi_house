// driver.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Taxi } from '../../taxis/entities/taxi.entity';
import { Breakdown } from '../../breakdowns/entities/breakdown.entity';
import { Problem } from '../../problems/entities/problem.entity';
import { User } from '../../user/entities/user.entity'; // Importez l'entité User

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  age: number;

  @Column()
  experience: string;

  @Column()
  phoneNumber: string;

  @Column()
  contractStartDate: Date;

  @Column()
  workingHoursStart: string;

  @Column()
  workingHoursEnd: string;

  @Column()
  restDays: string;

  @Column()
  taxiId: number;

  @ManyToOne(() => Taxi, taxi => taxi.drivers)
  taxi: Taxi;

  @ManyToOne(() => User, user => user.driver) 
  user: User;

  @OneToMany(() => Breakdown, breakdown => breakdown.driver)
  breakdowns: Breakdown[];

  @OneToMany(() => Problem, problem => problem.driver)
  problems: Problem[];
}
