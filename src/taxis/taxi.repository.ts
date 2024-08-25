import { EntityRepository, Repository } from 'typeorm';
import { Taxi } from './entities/taxi.entity';

@EntityRepository(Taxi)
export class TaxiRepository extends Repository<Taxi> {
  // Vous pouvez ajouter des méthodes spécifiques pour l'entité Taxi si nécessaire
}
