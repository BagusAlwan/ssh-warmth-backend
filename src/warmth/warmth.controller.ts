import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { WarmthService } from './warmth.service';
import { LayersDto } from './dto/layers.dto';

@Controller('warmth')
export class WarmthController {
  constructor(private readonly warmthService: WarmthService) {}

  @Post()
  calculateWarmth(@Body() layersDto: LayersDto) {
    if (!layersDto.layers) {
      throw new BadRequestException("'layers' is required.");
    }
    return this.warmthService.calculateWarmth(layersDto.layers);
  }
}
