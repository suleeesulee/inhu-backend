import { ToBoolean } from '@libs/common/decorator/to-boolean.decorator';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateMenuIsMainDto {
  /**
   * 대표 메뉴 여부
   * @example true
   */
  @IsNotEmpty()
  @ToBoolean()
  @IsBoolean()
  public isMain: boolean;
}
