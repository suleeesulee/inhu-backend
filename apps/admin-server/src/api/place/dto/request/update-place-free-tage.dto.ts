import { ToArray } from '@libs/common/decorator/to-array.decorator';
import { TrimStringArray } from '@libs/common/decorator/trim-string-array.decorator';
import { UniqueArray } from '@libs/common/decorator/unique-array.decorator';
import { IsString } from 'class-validator';

export class UpdatePlaceFreeTagDto {
  @ToArray()
  @TrimStringArray()
  @UniqueArray()
  @IsString({ each: true })
  freeTagList: string[];
}
