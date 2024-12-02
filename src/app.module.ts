import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { WarmthModule } from './warmth/warmth.module';
import { ConfigModule } from '@nestjs/config';
import { RecommendationModule } from './recommendation/recommendation.module';
import { PredictionModule } from './prediction/prediction.module'; // Import the PredictionModule

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WeatherModule,
    WarmthModule,
    RecommendationModule,
    PredictionModule, // Import the module instead of adding the controller and provider
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
