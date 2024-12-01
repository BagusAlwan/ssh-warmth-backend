import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class PredictionService {
  // Function to call the Python script for prediction
  async predict(imagePath: string): Promise<any> {
    try {
      // Run the Python script and suppress the warnings using the Python `warnings` module
      const result = await execPromise(
        `python3 /home/bgslwn/src/school/softwarePP/warmssh/src/prediction/predict.py ${imagePath}`,
      );

      // Assuming your Python script returns JSON
      return JSON.parse(result.stdout); // Parse the result and return it
    } catch (error) {
      console.error('Error during prediction:', error); // Log error for debugging
      throw new Error(
        'Prediction failed: ' + (error.message || 'Unknown error'),
      );
    }
  }
}
