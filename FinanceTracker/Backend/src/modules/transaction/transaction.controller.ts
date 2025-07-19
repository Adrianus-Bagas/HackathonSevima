import { Controller, Get, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvOrXlsxMulterEngine } from 'src/utils/CSVEngine';
import { Worksheet } from 'exceljs';
import { FilterDto } from './dto/filter.dto';

@Controller('transaction')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.create(createTransactionDto);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: new CsvOrXlsxMulterEngine({
      maxFileSize: 1000000000,
      destKey: 'worksheet'
    })
  }))
  async upload(@UploadedFile() data: {worksheet: Worksheet}) {
    return await this.transactionService.uploadFile(data)
  }

  @Post('/pagelist')
  async findAll(@Body() filterDto: FilterDto) {
    return await this.transactionService.findTransaction(filterDto);
  }
}
