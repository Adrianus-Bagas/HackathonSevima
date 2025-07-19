import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StopsModule } from './modules/stops/stops.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [StopsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
