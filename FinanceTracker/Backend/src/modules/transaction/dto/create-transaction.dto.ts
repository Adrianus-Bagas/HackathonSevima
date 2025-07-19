import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    source: string;

    @IsNotEmpty()
    @IsNumber()
    total: number;

    @IsNotEmpty()
    created_at: string;

    @IsNotEmpty()
    @IsString()
    userId: string;
}
