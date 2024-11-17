import { Injectable } from '@nestjs/common';
import { LayerPropertiesDto } from './dto/layersProeprty.dto';

@Injectable()
export class WarmthService {
  calculateWarmth(layers: LayerPropertiesDto): { warmthIndex: number } {
    const weights = {
      outerLayer: 0.4,
      midLayer: 0.3,
      baseLayer: 0.2,
      lowerBody: 0.2,
      accessories: 0.1,
    };

    const warmthIndex = Object.keys(weights).reduce((total, layer) => {
      const layerValue = layers[layer] || 0;
      const weight = weights[layer] || 0;
      return total + layerValue * weight;
    }, 0);

    return { warmthIndex: Math.round(warmthIndex * 100) / 100 };
  }
}
