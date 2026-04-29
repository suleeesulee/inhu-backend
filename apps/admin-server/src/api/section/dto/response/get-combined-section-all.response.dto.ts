import { MagazineSectionEntity } from '@admin/api/section/entity/magazine-section.entity';
import { PlaceSectionEntity } from '@admin/api/section/entity/place-section.entity';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

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

export class GetCombinedSectionAllResponseDto {
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
