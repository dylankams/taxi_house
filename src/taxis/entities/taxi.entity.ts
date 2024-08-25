import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Driver } from '../../drivers/entities/driver.entity';
import { Breakdown } from '../../breakdowns/entities/breakdown.entity';

@Entity()
export class Taxi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marque: string;

  @Column()
  modele: string;

  @Column()
  immatriculation: string;

  @Column()
  anneeFabrication: number;

  @OneToMany(() => Driver, driver => driver.taxi)
  drivers: Driver[];

  @OneToMany(() => Breakdown, breakdown => breakdown.taxi)
  breakdowns: Breakdown[];
}