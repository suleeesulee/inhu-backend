import { PickType } from '@nestjs/swagger';
import { CreateDailyMemoDto } from './create-daily-memo.dto';

export class UpdateDailyMemoDto extends PickType(CreateDailyMemoDto, [
  'content',
]) {}
