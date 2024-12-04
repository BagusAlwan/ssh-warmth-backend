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
    console.log('Received request:', body);

    const { lat, lon, warmthIndex } = body;

    try {
      const weather = await this.weatherService.getWeather(lat, lon);
      console.log('Fetched weather data:', weather);

      const { temp, wind_speed } = weather.main;

      const recommendations = this.recommendationService.recommendation(
        temp,
        wind_speed,
        warmthIndex,
      );
      console.log('Generated recommendations:', recommendations);

      return { recommendations };
    } catch (error) {
      console.error('Error in recommendation controller:', error.message);
      throw new Error('Failed to fetch recommendations');
    }
  }
}
