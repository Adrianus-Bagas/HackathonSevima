import { Module } from '@nestjs/common';
import { StopsService } from './stops.service';
import { StopsController } from './stops.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
  controllers: [StopsController],
  providers: [StopsService],
  imports: [PrismaModule],
})
export class StopsModule {}
