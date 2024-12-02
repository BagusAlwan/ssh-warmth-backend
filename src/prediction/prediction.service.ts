import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class PredictionService {
  // Function to call the Python script for prediction
  async predict(imagePath: string): Promise<any> {
    try {
      console.log('Executing prediction script with image:', imagePath);

      // Execute the Python script
      const result = await execPromise(
        `python3 /home/bgslwn/src/school/softwarePP/warmssh/src/prediction/predict.py "${imagePath}"`,
      );

      console.log('Python script stdout:', result.stdout);

      // Parse and return the JSON result
      return JSON.parse(result.stdout);
    } catch (error) {
      console.error('Prediction script stderr:', error.stderr);
      console.error('Prediction script stdout:', error.stdout);
      console.error('Error during prediction:', error.message);

      throw new Error('Prediction failed: ' + error.message);
    }
  }
}
