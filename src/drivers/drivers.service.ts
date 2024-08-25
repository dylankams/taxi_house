import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverRepository } from './driver.repository';
import axios from 'axios';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: DriverRepository,
  ) {}

  async findAll(): Promise<Driver[]> {
    return this.driverRepository.find();
  }

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = new Driver();
    driver.name = createDriverDto.name;
    driver.surname = createDriverDto.surname;
    driver.age = createDriverDto.age;
    driver.experience = createDriverDto.experience;
    driver.phoneNumber = createDriverDto.phoneNumber;
    driver.contractStartDate = createDriverDto.contractStartDate;
    driver.workingHoursStart = createDriverDto.workingHoursStart;
    driver.workingHoursEnd = createDriverDto.workingHoursEnd;
    driver.restDays = createDriverDto.restDays;
    driver.taxiId = createDriverDto.taxiId;

    return this.driverRepository.save(driver);
  }

  async findOne(id: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({ where: { id } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async update(id: number, updateDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = await this.driverRepository.findOne({ where: { id } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    driver.name = updateDriverDto.name;
    driver.surname = updateDriverDto.surname;
    driver.age = updateDriverDto.age;
    driver.experience = updateDriverDto.experience;
    driver.phoneNumber = updateDriverDto.phoneNumber;
    driver.contractStartDate = updateDriverDto.contractStartDate;
    driver.workingHoursStart = updateDriverDto.workingHoursStart;
    driver.workingHoursEnd = updateDriverDto.workingHoursEnd;
    driver.restDays = updateDriverDto.restDays;
    driver.taxiId = updateDriverDto.taxiId;

    return this.driverRepository.save(driver);
  }

  async initiatePayment(amount: number): Promise<string> {

    try {
        const response = await axios.post('https://api-checkout.cinetpay.com/v2/payment', {
            apikey: '39635987966b3c197814e88.53646958',
            site_id: '5877458',
            transaction_id: Math.floor(Math.random() * 100000000).toString(), 
            amount,
            currency: 'XAF',
            description: 'Dépôt recette quotidienne',
            notify_url: 'http://votrebackend.com/notify',
            return_url: 'http://votrebackend.com/payment-success',
            channels: 'MOBILE_MONEY',
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data.data.payment_url; // Retourne l'URL de paiement
    } catch (error) {
        // Gère l'erreur et renvoie un message clair
        if (axios.isAxiosError(error) && error.response) {
            console.error('Erreur lors de l\'initialisation du paiement :', error.response.data);
            throw new Error(`Erreur lors de l'initialisation du paiement : ${error.response.data.message}`);
        } else {
            console.error('Erreur inconnue :', error);
            throw new Error('Une erreur inconnue est survenue lors de l\'initialisation du paiement.');
        }
    }
  }

}
