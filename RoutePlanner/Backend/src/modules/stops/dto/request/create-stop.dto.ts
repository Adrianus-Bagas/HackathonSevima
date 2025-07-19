import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  x_axis: number;

  @IsNumber()
  @IsOptional()
  y_axis: number;

  @IsNotEmpty()
  grid: number[][];
}
