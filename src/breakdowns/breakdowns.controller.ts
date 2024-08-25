import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { BreakdownsService } from './breakdowns.service';
import { CreateBreakdownDto } from './dto/create-breakdown.dto';

// Étendre l'interface Request pour inclure l'utilisateur
interface RequestWithUser extends Request {
  user?: { id: number }; // Optionnel si vous avez un utilisateur attaché
}

@Controller('breakdowns')
export class BreakdownsController {
  constructor(private readonly breakdownsService: BreakdownsService) {}

  @Post()
  create(@Body() createBreakdownDto: CreateBreakdownDto) {
    const { breakdownType, description, userId } = createBreakdownDto;
    return this.breakdownsService.create(breakdownType, description, userId);
  }

  @Get()
  findAll() {
    return this.breakdownsService.findAll();
  }
}