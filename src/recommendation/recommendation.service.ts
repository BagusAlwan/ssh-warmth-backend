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

  //logic nya for now like this
  private calculateIdealWarmthIndex(temp: number, windSpeed: number): number {
    if (temp > 20) {
      return 0.5;
    } else if (temp > 10) {
      return 1.0;
    } else {
      return 1.5 + windSpeed * 0.1; //added wind for wind breeze
    }
  }
}
