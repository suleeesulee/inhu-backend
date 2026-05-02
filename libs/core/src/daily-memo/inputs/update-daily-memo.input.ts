import { PartialType } from '@nestjs/swagger';
import { CreateDailyMemoInput } from './create-daily-memo.input';

export class UpdateDailyMemoInput extends PartialType(CreateDailyMemoInput) {}
