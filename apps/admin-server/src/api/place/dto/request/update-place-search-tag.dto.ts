import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { TrimStringArray } from '@libs/common/decorator/trim-string-array.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { IsString } from 'class-validator';

export class UpdatePlaceSearchTagDto {
  /**
   * 검색 태그 목록
   *
   * @example ['돈가스', '돈까스']
   */
  @ToArray()
  @TrimStringArray()
  @UniqueArray()
  @IsString({ each: true })
  searchTagList: string[];
}
