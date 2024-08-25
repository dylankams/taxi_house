import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breakdown } from './entities/breakdown.entity';
import { DriverRepository } from '../drivers/driver.repository';
import { UserRepository } from '../user/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { Driver } from 'src/drivers/entities/driver.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BreakdownsService {
  constructor(
    @InjectRepository(Breakdown)
    private breakdownRepository: Repository<Breakdown>,
    @InjectRepository(Driver)
    private driverRepository: DriverRepository, // Inject DriverRepository
    @InjectRepository(User)
    private userRepository: UserRepository, // Inject UserRepository
    private mailerService: MailerService,
  ) {}

  async create(breakdownType: string, description: string, userId: number): Promise<Breakdown> {
    // Find the user with the related driver and taxi information
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['driver'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Get the driver associated with the user
    const driver = await this.driverRepository.findOne({
      where: { id: user.driver.id },
      relations: ['taxi'],
    });
    if (!driver) {
      throw new Error('Driver not found');
    }

    // Create a new breakdown entry
    const breakdown = this.breakdownRepository.create({
      breakdownType,
      description,
      driver,
      taxi: driver.taxi,
      user,
      status: 'non traité',
      createdAt: new Date(),
    });
    await this.breakdownRepository.save(breakdown);

    // Send notification email
    await this.mailerService.sendMail({
      to: 'dylankam989@gmail.com',
      subject: 'Nouvelle panne déclarée',
      template: './breakdownNotification',
      context: {
        taxi: driver.taxi.immatriculation,
        driver: `${driver.surname} ${driver.name}`,
        breakdownType,
        description,
      },
    });

    return breakdown;
  }

  async findAll(): Promise<Breakdown[]> {
    return this.breakdownRepository.find({ relations: ['taxi', 'driver', 'user'] });
  }
}