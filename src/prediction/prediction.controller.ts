import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PredictionService } from './prediction.service';
import * as fs from 'fs';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async predict(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    console.log('Uploaded file:', file);
    try {
      const result = await this.predictionService.predict(file.path);
      fs.unlinkSync(file.path);
      return { success: true, data: result };
    } catch (error) {
      fs.unlinkSync(file.path);
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException(
        `Prediction failed: ${error.message}`,
      );
    }
  }
}
