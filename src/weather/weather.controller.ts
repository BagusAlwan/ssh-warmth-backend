import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('lat') lat: string, @Query('lon') lon: string) {
    if (!lat || !lon) {
      throw new BadRequestException("'lat' and 'lon' are required.");
    }
    return this.weatherService.getWeather(lat, lon);
  }
}
