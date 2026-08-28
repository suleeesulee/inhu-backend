import { PartialType } from '@nestjs/swagger';
import { CreateNoticeDto } from './create-notice.dto';

export class UpdateNoticeByIdxDto extends PartialType(CreateNoticeDto) {}
