import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import { join } from 'path';

const execPromise = promisify(exec);

@Injectable()
export class PredictionService {
  async predict(imagePath: string): Promise<any> {
    try {
      // Ensure the file exists before proceeding
      if (!fs.existsSync(imagePath)) {
        throw new Error(`File does not exist: ${imagePath}`);
      }

      const scriptPath = `"C:\\Users\\bgslw\\src\\school\\SEPP\\ssh-warmth-backend\\src\\prediction\\predict.py"`;

      console.log('Executing prediction script with image:', imagePath);

      // Use dynamic Python command based on platform
      const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

      // Execute the Python script
      const result = await execPromise(
        `${pythonCommand} "${scriptPath}" "${imagePath}"`,
      );

      console.log('Python script stdout:', result.stdout);

      // Parse and return the JSON result
      try {
        const parsedOutput = JSON.parse(result.stdout);
        return parsedOutput;
      } catch (parseError) {
        console.error('Error parsing Python script output:', parseError);
        throw new Error('Failed to parse prediction output.');
      }
    } catch (error) {
      console.error('Error executing prediction script:', error);
      if (error.stderr) console.error('Script stderr:', error.stderr);
      if (error.stdout) console.error('Script stdout:', error.stdout);
      console.error('Full error object:', error);

      throw new Error(`Prediction failed: ${error.message}`);
    }
  }
}
