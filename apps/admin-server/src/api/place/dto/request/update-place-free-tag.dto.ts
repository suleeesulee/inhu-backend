import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { TrimStringArray } from '@libs/common/decorator/trim-string-array.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { IsString } from 'class-validator';

export class UpdatePlaceFreeTagDto {
  /**
   * 자유 태그 목록
   *
   * @example ['가성비 좋은', '조용한']
   */
  @ToArray()
  @TrimStringArray()
  @UniqueArray()
  @IsString({ each: true })
  freeTagList: string[];
}
