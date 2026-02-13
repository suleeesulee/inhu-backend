import { Prisma } from '@prisma/client';

export class CreateDimRoadAddressInput {
  idx: number;
  addressName: string;
  detailAddress: string | null;
  addressX: Prisma.Decimal | string;
  addressY: Prisma.Decimal | string;
}
