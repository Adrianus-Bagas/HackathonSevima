import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UserService {

  constructor(private readonly prismaService: PrismaService, @Inject(REQUEST) private req: any,){}

  async findOne(id: string) {
    const getUser = await this.prismaService.user.findFirst({
      where: {
        Id: id
      },
      omit: {
        password: true
      }
    })
    if(!getUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
    }
    if (getUser.Id !== this.req.user.id) {
      throw new HttpException(
        'User can only access their own profile',
        HttpStatus.FORBIDDEN,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      result: getUser
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const getUser = await this.prismaService.user.findFirst({
      where: {
        Id: id
      },
      omit: {
        password: true
      }
    })
    if(!getUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
    }
    if (getUser.Id !== this.req.user.id) {
      throw new HttpException(
        'User can only access their own profile',
        HttpStatus.FORBIDDEN,
      );
    }
    const result = await this.prismaService.user.update({
      where: {
        Id: id
      },
      data: {
        ...updateUserDto
      }
    })
    if(!result) {
      throw new HttpException('Update user failed', HttpStatus.BAD_REQUEST)
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Update user success'
    };
  }
}
