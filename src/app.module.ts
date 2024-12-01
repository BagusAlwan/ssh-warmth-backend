import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { WarmthModule } from './warmth/warmth.module';
import { ConfigModule } from '@nestjs/config';
import { RecommendationModule } from './recommendation/recommendation.module';
import { PredictionService } from './prediction/prediction.service';
import { PredictionController } from './prediction/prediction.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WeatherModule,
    WarmthModule,
    RecommendationModule,
  ],
  controllers: [AppController, PredictionController],
  providers: [AppService, PredictionService],
})
export class AppModule {}
