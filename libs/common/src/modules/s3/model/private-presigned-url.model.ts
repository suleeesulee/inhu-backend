import { PickType } from '@nestjs/swagger';
import { PresignedUrlModel } from './presigned-url.model';

/**
 * Private Presigned URL과 파일 키를 담는 모델
 */
export class PrivatePresignedUrlModel extends PickType(PresignedUrlModel, [
  'url',
  'fields',
  'filePath',
]) {}
