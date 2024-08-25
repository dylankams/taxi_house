import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  description: string;
  userId: number;
}