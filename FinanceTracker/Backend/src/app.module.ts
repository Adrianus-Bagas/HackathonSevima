import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    TransactionModule,
    MulterModule.register({
      dest: './upload'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
