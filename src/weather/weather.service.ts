import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getWeather(lat: string, lon: string): Promise<any> {
    const apiKey = this.configService.get<string>('WEATHER_API_KEY');
    if (!apiKey) {
      throw new Error(
        'Weather API key is not configured. Please set WEATHER_API_KEY in the environment.',
      );
    }

    const url = `https://api.openweathermap.org/data/2.5/weather`;

    try {
      const response = await this.httpService
        .get(url, {
          params: {
            lat,
            lon,
            appid: apiKey,
            units: 'metric',
          },
        })
        .toPromise();

      console.log('Weather API response:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error response from Weather API:', error.response?.data);
        throw new Error(
          `Failed to fetch weather data: ${error.response?.data?.message || error.message}`,
        );
      } else {
        console.error('Unexpected error:', error.message);
        throw new Error(
          'An unexpected error occurred while fetching weather data.',
        );
      }
    }
  }
}
