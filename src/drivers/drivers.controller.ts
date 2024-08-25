import { Controller, Get, Post, Body } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Driver } from './entities/driver.entity';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  findAll(): Promise<Driver[]> {
    return this.driversService.findAll();
  }

  @Post()
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driversService.create(createDriverDto);
  }

  @Post('daily-deposit')
  async dailyDeposit(@Body('amount') amount: number) {
    const paymentUrl = await this.driversService.initiatePayment(amount);
    return { paymentUrl };
  }
}