import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStopDto } from './dto/request/create-stop.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { aStarSearch } from 'src/utils/AStarAlgorithm';
import { FindRouteDto } from './dto/request/find-route-dto';

@Injectable()
export class StopsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createStopDto: CreateStopDto) {
    const isStopsExist = await this.prismaService.busStops.findFirst({
      where: {
        name: createStopDto.name,
      },
    });
    if (isStopsExist) {
      throw new HttpException('Stop exists', HttpStatus.BAD_REQUEST);
    }
    let generatedXAxis = Math.floor(Math.random() * 20);
    let generatedYAxis = Math.floor(Math.random() * 20);

    const generatedGrid = createStopDto.grid;

    while (generatedGrid[generatedXAxis][generatedYAxis] === 0) {
      generatedXAxis = Math.floor(Math.random() * 20);
      generatedYAxis = Math.floor(Math.random() * 20);
    }

    const createStops = await this.prismaService.busStops.create({
      data: {
        name: createStopDto.name,
        x_axis: createStopDto.x_axis || generatedXAxis,
        y_axis: createStopDto.y_axis || generatedYAxis,
      },
    });
    if (!createStops) {
      throw new HttpException('Fail to create stops', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Create stops success',
    };
  }

  async findAll() {
    const getAllStops = await this.prismaService.busStops.findMany();
    if (!getAllStops) {
      throw new HttpException('Fail to get stops data', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all stops success',
    };
  }

  generateGrid() {
    const gridResult: number[][] = [];
    for (let i = 0; i < 20; i++) {
      const grid: number[] = [];
      for (let j = 0; j < 20; j++) {
        grid.push(Math.random() > 0.5 ? 1 : 0);
      }
      gridResult.push(grid);
    }
    return {
      statusCode: HttpStatus.OK,
      message: gridResult,
    };
  }

  async findRoute(findRouteDto: FindRouteDto) {
    const getDepartureCoordinate = await this.prismaService.busStops.findFirst({
      where: {
        id: findRouteDto.id_departure,
      },
    });

    const getArrivalCoordinate = await this.prismaService.busStops.findFirst({
      where: {
        id: findRouteDto.id_arrival,
      },
    });

    if (!getArrivalCoordinate || !getDepartureCoordinate) {
      throw new HttpException('Stops not found', HttpStatus.BAD_REQUEST);
    }
    
    const path = aStarSearch(
      findRouteDto.grid,
      [getDepartureCoordinate.x_axis, getDepartureCoordinate.y_axis],
      [getArrivalCoordinate.x_axis, getArrivalCoordinate.y_axis],
    );

    if(!path) {
      throw new HttpException('Stops cannot be accessed', HttpStatus.BAD_REQUEST)
    }

    let distance: number = 0;
    
    for(let i=0;i<path.length-1;i++) {
      distance += Math.sqrt(((path[i][0]-path[i+1][0]) * (path[i][0]-path[i+1][0])) + (path[i][1]-path[i+1][1]) * (path[i][1]-path[i+1][1]));
    }

    return {
      statusCode: HttpStatus.OK,
      path,
      distance: distance.toFixed(2)+" km"
    }
  }
}
