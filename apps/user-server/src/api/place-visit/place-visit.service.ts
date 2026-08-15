import { PlaceVisitCoreService } from '@libs/core/place-visit/place-visit-core.service';
import { NfcCoreService } from '@libs/core/nfc/nfc-core.service';
import {
  decryptNfcPiccData,
  deriveNfcAesKey,
  deriveNfcSessionMacKey,
  verifyNfcMac,
} from '@libs/core/nfc/nfc-crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePlaceVisitByNfcDto } from './dto/request/create-place-visit-by-nfc.dto';
import { GetPlaceVisitAllDto } from './dto/request/get-place-visit-all.dto';
import { GetPlaceVisitAllResponseDto } from './dto/response/get-place-visit-all.response.dto';
import { PlaceVisitEntity } from './entity/place-visit.entity';

@Injectable()
export class PlaceVisitService {
  private readonly masterKey: Buffer;

  constructor(
    private readonly placeVisitCoreService: PlaceVisitCoreService,
    private readonly nfcCoreService: NfcCoreService,
    configService: ConfigService,
  ) {
    this.masterKey = this.readKey(configService, 'nfc.masterKey');
  }

  public async getPlaceVisitAllByUserIdx(
    dto: GetPlaceVisitAllDto,
    userIdx: number,
  ): Promise<GetPlaceVisitAllResponseDto> {
    const pageSize = 10;
    const skip = (dto.page - 1) * pageSize;

    return {
      placeVisitList: (
        await this.placeVisitCoreService.getPlaceVisitAllByUserIdx(userIdx, {
          take: pageSize,
          skip,
        })
      ).map(PlaceVisitEntity.fromModel),
    };
  }

  public async createPlaceVisitByNfc(
    userIdx: number,
    nfcIdx: number,
    dto: CreatePlaceVisitByNfcDto,
  ): Promise<PlaceVisitEntity> {
    const encryptedPiccData = Buffer.from(dto.encryptedPiccData, 'hex');
    const receivedMac = Buffer.from(dto.sdmMac, 'hex');
    const nfc = await this.nfcCoreService.getNfcByIdx(nfcIdx);

    if (!nfc) {
      throw new NotFoundException('NFC not found');
    }
    if (!nfc.activatedAt) {
      throw new ForbiddenException('NFC is not activated');
    }

    const expectedUid = Buffer.from(nfc.uid, 'hex');
    const nfcAesKey = deriveNfcAesKey(this.masterKey, expectedUid);

    let uid: Buffer;
    let readCounter: Buffer;

    try {
      ({ uid, readCounter } = decryptNfcPiccData(encryptedPiccData, nfcAesKey));
    } catch {
      throw new BadRequestException('Failed to decrypt NFC PICC data');
    }

    if (!uid.equals(expectedUid)) {
      throw new ForbiddenException('NFC UID does not match');
    }

    const sessionMacKey = deriveNfcSessionMacKey(nfcAesKey, uid, readCounter);
    if (!verifyNfcMac(sessionMacKey, receivedMac)) {
      throw new ForbiddenException('Invalid NFC MAC');
    }

    return PlaceVisitEntity.fromModel(
      await this.placeVisitCoreService.createPlaceVisit({
        userIdx,
        nfcIdx: nfc.idx,
        score: nfc.score,
      }),
    );
  }

  private readKey(configService: ConfigService, name: string): Buffer {
    const value = configService.getOrThrow<string>(name);

    if (!/^[0-9a-fA-F]{32}$/.test(value)) {
      throw new Error(`${name} must be a 16-byte hexadecimal value`);
    }

    return Buffer.from(value, 'hex');
  }
}
