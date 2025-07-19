import { Controller, Get, Post, Body } from '@nestjs/common';
import { StopsService } from './stops.service';
import { CreateStopDto } from './dto/request/create-stop.dto';
import { FindRouteDto } from './dto/request/find-route-dto';

@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Post()
  async create(@Body() createStopDto: CreateStopDto) {
    return await this.stopsService.create(createStopDto);
  }

  @Post('/api/rute')
  async findAll(@Body() findRouteDto: FindRouteDto) {
    return await this.stopsService.findRoute(findRouteDto);
  }

  @Get('/generate-grid')
  generateGrid() {
    return this.stopsService.generateGrid();
  }
}
