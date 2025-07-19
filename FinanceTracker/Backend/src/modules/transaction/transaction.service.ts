import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { categories } from 'src/utils/categories';
import { format } from 'src/utils/formatterCSV';
import { Worksheet } from 'exceljs';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class TransactionService {

  constructor(private readonly prismaService: PrismaService, @Inject(REQUEST) private req: any,){}

  async create(createTransactionDto: CreateTransactionDto) {

    const getCategories = categories.find((item)=>item.merchant.includes(createTransactionDto.source))

    const createTransaction = await this.prismaService.transaction.create({
      data: {
        ...createTransactionDto,
        userId: this.req.user.id,
        category: getCategories ? getCategories.type : "Other",
      }
    })
    if(!createTransaction) {
      throw new HttpException('Create transaction failed', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: "Create transaction success"
    };
  }

  async uploadFile(data: {worksheet: Worksheet}) {
    const result = format(data.worksheet);
    
    const dataToInput = result.map((item)=>{
      const getCategories = categories.find((value)=>value.merchant.includes(item.source as string ?? ''))
      return {
        description: item.description as string ?? '',
        source: item.source as string ?? '',
        total: item.total as number ?? 0,
        created_at: item.created_at as string ?? '',
        userId: item.user_id as string ?? '',
        category: getCategories ? getCategories.type : "Other"
      }
    })
    const uploadTransaction = await this.prismaService.transaction.createMany({
      data: [
        ...dataToInput
      ]
    })
    if(!uploadTransaction) {
      throw new HttpException('Fail to upload', HttpStatus.BAD_REQUEST)
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Upload success'
    };
  }

  async findTransaction(filterDto: FilterDto) {
    const result = await this.prismaService.transaction.findMany({
      where: {
        userId: this.req.user.id,
        category: filterDto.category,
        created_at: {
          contains: filterDto.month
        },
        source: filterDto.source,
        total: {
          gte: filterDto.totalFrom,
          lte: filterDto.totalTo
        }
      },
      take: filterDto.size,
      skip: filterDto.page
    })
    if(!result) {
      throw new HttpException('Fail to get transaction', HttpStatus.BAD_REQUEST)
    }
    return {
      statusCode: HttpStatus.OK,
      result
    }
  }
}
