import { IsOptional } from 'class-validator';

export class UpdateTaxiDto {
  @IsOptional()
  marque?: string;

  @IsOptional()
  modele?: string;

  @IsOptional()
  immatriculation?: string;

  @IsOptional()
  anneeFabrication?: number;
}