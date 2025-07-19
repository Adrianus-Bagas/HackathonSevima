import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  budget: number;
}