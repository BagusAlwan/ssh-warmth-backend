import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

const execPromise = promisify(exec);

@Injectable()
export class PredictionService {
  constructor(private readonly configService: ConfigService) {}
  async predict(imagePath: string): Promise<any> {
    try {
      if (!fs.existsSync(imagePath)) {
        throw new Error(`File does not exist: ${imagePath}`);
      }

      const scriptPath = this.configService.get<string>('SCRIPT_PATH');

      console.log('Executing prediction script with image:', imagePath);
      const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
      const result = await execPromise(
        `${pythonCommand} "${scriptPath}" "${imagePath}"`,
      );

      console.log('Python script stdout:', result.stdout);
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
