import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule,
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
