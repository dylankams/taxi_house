import { EntityRepository, Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';

@EntityRepository(Driver)
export class DriverRepository extends Repository<Driver> {
  // Vous pouvez ajouter des méthodes spécifiques pour l'entité Driver si nécessaire
}