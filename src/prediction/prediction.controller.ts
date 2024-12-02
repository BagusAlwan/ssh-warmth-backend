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

    // Validate file type and size
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed.');
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      throw new BadRequestException('File size exceeds the limit of 5MB.');
    }

    try {
      const result = await this.predictionService.predict(file.path);

      // Delete file after processing
      fs.unlinkSync(file.path);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      fs.unlinkSync(file.path); // Cleanup on error
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException(
        `Prediction failed: ${error.message}`,
      );
    }
  }
}
