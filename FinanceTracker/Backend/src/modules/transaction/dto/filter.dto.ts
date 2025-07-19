import { IsNumber, IsOptional, IsString } from "class-validator";

export class FilterDto {
    @IsOptional()
    @IsString()
    source: string;
    @IsOptional()
    @IsString()
    month: string;
    @IsOptional()
    @IsString()
    category: string;
    @IsOptional()
    @IsNumber()
    totalFrom: number;
    @IsOptional()
    @IsNumber()
    totalTo: number;
    @IsOptional()
    @IsNumber()
    page: number;
    @IsOptional()
    @IsNumber()
    size: number;
}
