import { Module } from '@nestjs/common';
import { WarmthController } from './warmth.controller';
import { WarmthService } from './warmth.service';
import { WeatherService } from 'src/weather/weather.service';

@Module({
  controllers: [WarmthController],
  providers: [WarmthService],
})
export class WarmthModule {}
