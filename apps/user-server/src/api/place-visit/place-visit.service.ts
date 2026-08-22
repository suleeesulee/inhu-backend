import { PlaceVisitCoreService } from '@libs/core/place-visit/place-visit-core.service';
import { NfcCoreService } from '@libs/core/nfc/nfc-core.service';
import {
  decryptNfcPiccData,
  deriveNfcFileReadKey,
  deriveNfcMetaReadKey,
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
import { GetPlaceVisitAllDto } from './dto/request/get-place-visit-all.dto';
import { GetPlaceVisitAllResponseDto } from './dto/response/get-place-visit-all.response.dto';
import { PlaceVisitEntity } from './entity/place-visit.entity';
import { CreatePlaceVisitByNfcDto } from './dto/request/create-place-visit-by-nfc.dto';

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
    dto: CreatePlaceVisitByNfcDto,
  ): Promise<PlaceVisitEntity> {
    const encryptedPiccData = Buffer.from(dto.picc_data, 'hex');
    const receivedMac = Buffer.from(dto.cmac, 'hex');
    const metaReadKey = deriveNfcMetaReadKey(this.masterKey);

    let uid: Buffer;
    let readCounter: Buffer;

    try {
      ({ uid, readCounter } = decryptNfcPiccData(
        encryptedPiccData,
        metaReadKey,
      ));
    } catch {
      throw new BadRequestException('Failed to decrypt NFC PICC data');
    }

    const nfc = await this.nfcCoreService.getNfcByUid(
      uid.toString('hex').toUpperCase(),
    );

    if (!nfc) {
      throw new NotFoundException('NFC not found');
    }
    if (!nfc.activatedAt) {
      throw new ForbiddenException('NFC is not activated');
    }

    const fileReadKey = deriveNfcFileReadKey(this.masterKey, uid);
    const sessionMacKey = deriveNfcSessionMacKey(fileReadKey, uid, readCounter);
    const macInput = dto.enc
      ? Buffer.from(`${dto.enc.toUpperCase()}&cmac=`, 'ascii')
      : undefined;

    if (!verifyNfcMac(sessionMacKey, receivedMac, macInput)) {
      throw new ForbiddenException('Invalid NFC MAC');
    }

    return PlaceVisitEntity.fromModel(
      await this.placeVisitCoreService.createPlaceVisit({
        userIdx,
        nfcIdx: nfc.idx,
        score: nfc.score,
        latitude: dto.latitude,
        longitude: dto.longitude,
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
