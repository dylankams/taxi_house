import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBreakdownDto {
  @IsString()
  @IsNotEmpty()
  breakdownType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  userId: number;
}