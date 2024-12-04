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

    if (isNaN(Number(lat)) || isNaN(Number(lon))) {
      throw new BadRequestException("'lat' and 'lon' must be valid numbers.");
    }

    if (Number(lat) < -90 || Number(lat) > 90) {
      throw new BadRequestException("'lat' must be between -90 and 90.");
    }

    if (Number(lon) < -180 || Number(lon) > 180) {
      throw new BadRequestException("'lon' must be between -180 and 180.");
    }

    return this.weatherService.getWeather(lat, lon);
  }
}
