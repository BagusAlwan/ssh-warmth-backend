import { Body, Controller, Post } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { WeatherService } from 'src/weather/weather.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly weatherService: WeatherService,
  ) {}

  @Post()
  async reccomClothes(
    @Body() body: { lat: string; lon: string; warmthIndex: number },
  ): Promise<{ recommendations: string[] }> {
    const { lat, lon, warmthIndex } = body;
    const weather = await this.weatherService.getWeather(lat, lon);
    const { temp, wind_speed } = weather.main;

    const recommendations = this.recommendationService.recommendation(
      temp,
      wind_speed,
      warmthIndex,
    );
    return { recommendations };
  }
}
