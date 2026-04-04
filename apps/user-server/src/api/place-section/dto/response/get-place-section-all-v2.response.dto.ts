import { ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { PlaceSectionEntity } from '../../entity/place-section.entity';
import { MagazineSectionEntity } from '@user/api/magazine-section/entity/magazine-section.entity';

export class PlaceSectionItem extends PlaceSectionEntity {
  /**
   * @example 'PLACE'
   */
  type: 'PLACE';
}

export class MagazineSectionItem extends MagazineSectionEntity {
  /**
   * @example 'MAGAZINE'
   */
  type: 'MAGAZINE';
}

export class GetPlaceSectionAllV2ResponseDto {
  hasNext: boolean;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(PlaceSectionItem) },
        { $ref: getSchemaPath(MagazineSectionItem) },
      ],
    },
  })
  combinedSectionList: (PlaceSectionItem | MagazineSectionItem)[];
}
