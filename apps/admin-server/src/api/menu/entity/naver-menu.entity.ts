import { PickType } from '@nestjs/swagger';
import { MenuEntity } from './menu.entity';
import { NaverMenu } from '@libs/common/modules/naver-menu/naver-menu';

export class NaverMenuEntity extends PickType(MenuEntity, [
  'name',
  'content',
  'price',
  'imagePath',
  'isFlexible',
]) {
  constructor(data: NaverMenuEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(model: NaverMenu): NaverMenuEntity {
    return new NaverMenuEntity({
      name: model.name,
      content: model.content,
      price: model.price,
      imagePath: model.imagePath,
      isFlexible: model.isFlexible,
    });
  }
}
