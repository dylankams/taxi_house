import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';

// Étendre l'interface Request pour inclure l'utilisateur
interface RequestWithUser extends Request {
  user?: { id: number }; // Optionnel si vous avez un utilisateur attaché
}

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemsService.create(createProblemDto.description, createProblemDto.userId);
  }

  @Get()
  findAll() {
    return this.problemsService.findAll();
  }
}