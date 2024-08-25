import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxiRepository } from './taxi.repository'; // Importez TaxiRepository
import { DriverRepository } from '../drivers/driver.repository'; // Importez DriverRepository
import { Taxi } from './entities/taxi.entity';
import { CreateTaxiDto } from './dto/create-taxi.dto';
import { UpdateTaxiDto } from './dto/update-taxi.dto'; // Importez le DTO de mise à jour

@Injectable()
export class TaxisService {
  private readonly logger = new Logger(TaxisService.name);

  constructor(
    @InjectRepository(TaxiRepository)
    private taxiRepository: TaxiRepository, // Injectez TaxiRepository
    @InjectRepository(DriverRepository)
    private driverRepository: DriverRepository // Injectez DriverRepository
  ) {}

  async findAll(): Promise<Taxi[]> {
    this.logger.log('Fetching all taxis');
    try {
      const taxis = await this.taxiRepository.find();
      this.logger.log(`Found ${taxis.length} taxis`);
      return taxis;
    } catch (error) {
      this.logger.error('Error fetching taxis', error.stack);
      throw error;
    }
  }

  async create(createTaxiDto: CreateTaxiDto): Promise<Taxi> {
    this.logger.log('Creating a new taxi');
    this.logger.debug(`CreateTaxiDto: ${JSON.stringify(createTaxiDto)}`);
    try {
      const { marque, modele, immatriculation, anneeFabrication } = createTaxiDto;
      const newTaxi = this.taxiRepository.create({ marque, modele, immatriculation, anneeFabrication });
      const savedTaxi = await this.taxiRepository.save(newTaxi);
      this.logger.log(`Taxi created with ID ${savedTaxi.id}`);
      return savedTaxi;
    } catch (error) {
      this.logger.error('Error creating taxi', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Taxi> {
    this.logger.log(`Fetching taxi with ID ${id}`);
    try {
      const taxi = await this.taxiRepository.findOne({ where: { id } });
      if (!taxi) {
        this.logger.warn(`Taxi with ID ${id} not found`);
        throw new NotFoundException(`Taxi with ID ${id} not found`);
      }
      this.logger.log(`Found taxi with ID ${id}`);
      return taxi;
    } catch (error) {
      this.logger.error('Error fetching taxi', error.stack);
      throw error;
    }
  }

  async update(id: number, updateTaxiDto: UpdateTaxiDto): Promise<Taxi> {
    this.logger.log(`Updating taxi with ID ${id}`);
    this.logger.debug(`UpdateTaxiDto: ${JSON.stringify(updateTaxiDto)}`);
    try {
      const taxi = await this.taxiRepository.findOne({ where: { id } });
      if (!taxi) {
        this.logger.warn(`Taxi with ID ${id} not found`);
        throw new NotFoundException(`Taxi with ID ${id} not found`);
      }

      taxi.marque = updateTaxiDto.marque || taxi.marque;
      taxi.modele = updateTaxiDto.modele || taxi.modele;
      taxi.immatriculation = updateTaxiDto.immatriculation || taxi.immatriculation;
      taxi.anneeFabrication = updateTaxiDto.anneeFabrication || taxi.anneeFabrication;

      const updatedTaxi = await this.taxiRepository.save(taxi);
      this.logger.log(`Taxi updated with ID ${id}`);
      return updatedTaxi;
    } catch (error) {
      this.logger.error('Error updating taxi', error.stack);
      throw error;
    }
  }

  async findTaxiByUserUsername(username: string): Promise<Taxi> {
    this.logger.log(`Finding taxi for user with username ${username}`);
    try {
      const driver = await this.driverRepository.createQueryBuilder('driver')
        .leftJoinAndSelect('driver.taxi', 'taxi')
        .leftJoinAndSelect('driver.user', 'user') // Ajoutez la jointure avec User
        .where('user.username = :username', { username })
        .getOne();

      if (!driver || !driver.taxi) {
        this.logger.warn(`Taxi for user with username ${username} not found`);
        throw new NotFoundException(`Taxi for user with username ${username} not found`);
      }

      this.logger.log(`Found taxi for user with username ${username}`);
      return driver.taxi;
    } catch (error) {
      this.logger.error('Error finding taxi by user username', error.stack);
      throw error;
    }
  }

  async generateTaxiSheet(id: number): Promise<string> {
    this.logger.log(`Generating taxi sheet for ID ${id}`);
    try {
      const taxi = await this.taxiRepository.findOne({ where: { id } });
      if (!taxi) {
        this.logger.warn(`Taxi with ID ${id} not found`);
        throw new NotFoundException(`Taxi with ID ${id} not found`);
      }

      let taxiSheet = `Fiche Taxi\n\n`;
      taxiSheet += `Marque: ${taxi.marque}\n`;
      taxiSheet += `Modèle: ${taxi.modele}\n`;
      taxiSheet += `Immatriculation: ${taxi.immatriculation}\n`;
      taxiSheet += `Année de fabrication: ${taxi.anneeFabrication}\n`;

      this.logger.log(`Taxi sheet generated for ID ${id}`);
      return taxiSheet;
    } catch (error) {
      this.logger.error('Error generating taxi sheet', error.stack);
      throw error;
    }
  }
}