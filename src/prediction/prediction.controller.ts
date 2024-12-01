import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  async predictWithTimeout(imagePath: string, timeout: number) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Prediction timed out')), timeout),
    );
    const predictionPromise = this.predictionService.predict(imagePath);

    return Promise.race([predictionPromise, timeoutPromise]);
  }

  @Post()
  async predict(@Body('imagePath') imagePath: string): Promise<any> {
    if (!imagePath) {
      throw new BadRequestException('Image path is required.');
    }

    try {
      const result = await this.predictWithTimeout(imagePath, 30000); // Set a 30 second timeout
      return result;
    } catch (error) {
      console.error(`Prediction failed: ${error.message}`);
      throw new BadRequestException(`Prediction failed: ${error.message}`);
    }
  }
}
