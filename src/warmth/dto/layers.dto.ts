import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LayerPropertiesDto } from './layersProeprty.dto';

export class LayersDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LayerPropertiesDto)
  layers: LayerPropertiesDto;
}
