import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt-config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private jwtService:JwtService) {}

  generateJWT(payload:any){
    return this.jwtService.sign(payload, {
      secret: jwt_config.secret,
      expiresIn: jwt_config.expired
    })
  }

  async register(data: RegisterDto) {
    const checkUser = await this.prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });
    if (checkUser) {
      throw new HttpException('User Sudah Terdaftar', HttpStatus.BAD_REQUEST);
    }
    data.password = await hash(data.password, 12);
    const newUser = await this.prisma.user.create({
      data: { 
        ...data,
        budget: 0
      },
    });
    if (newUser) {
      return {
        status: HttpStatus.OK,
        message: 'Register Berhasil',
      };
    }
  }

  async login(data: LoginDto) {
    const checkUser = await this.prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });
    if (!checkUser) {
      throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
    }
    const checkPassword = await compare(data.password, checkUser.password);
    if (checkPassword) {
      const accessToken = this.generateJWT({
        sub: checkUser.Id,
        name: checkUser.name,
        username: checkUser.username
      })
      return {
        status: HttpStatus.OK,
        message: 'Login Berhasil',
        accessToken
      };
    } else {
      throw new HttpException(
        'Username dan Password tidak cocok',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}