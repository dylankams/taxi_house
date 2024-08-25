import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breakdown } from './entities/breakdown.entity';
import { Taxi } from '../taxis/entities/taxi.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { BreakdownsService } from './breakdowns.service';
import { BreakdownsController } from './breakdowns.controller';
import { UserRepository } from '../user/user.repository';
import { DriverRepository } from '../drivers/driver.repository';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Breakdown, Taxi, Driver,User]),
  ],
  controllers: [BreakdownsController],
  providers: [BreakdownsService, UserRepository, DriverRepository]
})
export class BreakdownsModule {}
