import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Directory where uploaded files will be stored
    }),
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
