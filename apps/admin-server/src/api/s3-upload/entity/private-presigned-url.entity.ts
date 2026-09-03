import { PrivatePresignedUrlModel } from '@libs/common/modules/s3/model/private-presigned-url.model';
import { PickType } from '@nestjs/swagger';
import { PresignedUrlEntity } from './presigned-url.entity';

export class PrivatePresignedUrlEntity extends PickType(PresignedUrlEntity, [
  'url',
  'fields',
  'filePath',
]) {
  constructor(data: PrivatePresignedUrlEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: PrivatePresignedUrlModel,
  ): PrivatePresignedUrlEntity {
    return new PrivatePresignedUrlEntity({
      url: model.url,
      fields: model.fields,
      filePath: model.filePath,
    });
  }
}
