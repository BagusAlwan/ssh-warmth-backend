import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getWeather(lat: string, lon: string): Promise<any> {
    const apiKey = this.configService.get<string>('WEATHER_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather`;

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

    return response.data;
  }
}
