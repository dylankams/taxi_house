import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './entities/problem.entity';
import { DriverRepository } from '../drivers/driver.repository';
import { UserRepository } from '../user/user.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';
import { Driver } from 'src/drivers/entities/driver.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private problemRepository: Repository<Problem>,
    @InjectRepository(Driver)
    private driverRepository: DriverRepository,
    @InjectRepository(User)
    private userRepository: UserRepository,
    private mailerService: MailerService,
  ) {}

  async create(description: string, userId: number): Promise<Problem> {
    // Find the user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['driver'],
    });

    let driver = null;
    if (user && user.driver) {
      // Optionally find the driver again using driverRepository if needed
      driver = await this.driverRepository.findOne({
        where: { id: user.driver.id },
      });
    }

    // Create a new problem entry
    const problem = this.problemRepository.create({
      description,
      driver: driver || null, // Set driver to null if not found
      status: 'non traité',
      createdAt: new Date(),
    });
    await this.problemRepository.save(problem);

    // Determine the subject of the email and the template to use
    const subject = driver 
      ? 'Nouveau problème déclaré par un chauffeur' 
      : 'Nouveau problème déclaré par un sous-admin';

    const template = driver 
      ? './problemNotificationDriver' 
      : './problemNotificationSubAdmin';

    // Send notification email
    const mailContext = {
      description,
    };
    if (driver) {
      mailContext['driver'] = `${driver.surname} ${driver.name}`;
    }

    await this.mailerService.sendMail({
      to: 'dylankam989@gmail.com',
      subject: subject,
      template: template,
      context: mailContext,
    });

    return problem;
  }

  async findAll(): Promise<Problem[]> {
    return this.problemRepository.find({ relations: ['driver'] });
  }
}