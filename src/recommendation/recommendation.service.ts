import { Injectable } from '@nestjs/common';

@Injectable()
export class RecommendationService {
  recommendation(
    temp: number,
    windSpeed: number,
    warmthIndex: number,
  ): string[] {
    const idealWarmIndex = this.calculateIdealWarmthIndex(temp, windSpeed);

    if (warmthIndex > idealWarmIndex) {
      return ['Your clothes are sufficient'];
    }

    const deficit = idealWarmIndex - warmthIndex;
    if (deficit < 0.5) {
      return ['Add a Light Jacket', 'Consider using a scarf'];
    } else {
      return ['Add a Heavy Jacket', 'Consider adding another layer'];
    }
  }

  private calculateIdealWarmthIndex(temp: number, windSpeed: number): number {
    if (temp < 0) {
      return 2.5 + windSpeed * 0.1;
    } else if (temp <= 10) {
      return 2;
    } else if (temp <= 20) {
      return 1.5;
    } else {
      return 0.5;
    }
  }
}
