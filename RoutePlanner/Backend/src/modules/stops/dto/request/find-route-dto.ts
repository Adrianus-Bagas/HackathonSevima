import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindRouteDto {
  @IsNotEmpty()
  @IsNumber()
  id_departure: number;

  @IsNotEmpty()
  @IsNumber()
  id_arrival: number;

  @IsNotEmpty()
  grid: number[][];
}
