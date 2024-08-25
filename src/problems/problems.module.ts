import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { DriversModule } from '../drivers/drivers.module';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/user/entities/user.entity';
import { DriverRepository } from 'src/drivers/driver.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, User, Driver]),
    DriversModule
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService, UserRepository, DriverRepository],
})
export class ProblemsModule {}
