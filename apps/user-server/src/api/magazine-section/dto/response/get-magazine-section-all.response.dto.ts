import { MagazineSectionEntity } from '../../entity/magazine-section.entity';

export class GetMagazineSectionAllResponseDto {
  hasNext: boolean;
  magazineSectionEntityList: MagazineSectionEntity[];
}
