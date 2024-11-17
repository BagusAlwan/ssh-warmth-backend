import { IsOptional, IsNumber } from 'class-validator';

export class LayerPropertiesDto {
  @IsOptional()
  @IsNumber()
  outerLayer?: number;

  @IsOptional()
  @IsNumber()
  midLayer?: number;

  @IsOptional()
  @IsNumber()
  baseLayer?: number;

  @IsOptional()
  @IsNumber()
  lowerBody?: number;

  @IsOptional()
  @IsNumber()
  accessories?: number;

  // Add index signature to allow additional properties
  [key: string]: number | undefined;
}
