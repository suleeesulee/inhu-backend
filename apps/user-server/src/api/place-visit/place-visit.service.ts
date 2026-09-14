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
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetPlaceVisitAllDto } from './dto/request/get-place-visit-all.dto';
import { GetPlaceVisitAllResponseDto } from './dto/response/get-place-visit-all.response.dto';
import { PlaceVisitEntity } from './entity/place-visit.entity';
import { CreatePlaceVisitByNfcDto } from './dto/request/create-place-visit-by-nfc.dto';
import { Locker } from '@libs/common/decorator/locker.decorator';

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
    const placeVisitList =
      await this.placeVisitCoreService.getPlaceVisitAllByUserIdx(userIdx, {
        take: pageSize + 1,
        skip,
        order: dto.order,
      });

    return {
      hasNext: placeVisitList.length > pageSize,
      placeVisitList: placeVisitList
        .slice(0, pageSize)
        .map(PlaceVisitEntity.fromModel),
    };
  }

  @Locker({
    key: (userIdx: number) => `place-visit:${userIdx}`,
    ttl: 10_000,
  })
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

    await this.validatePlaceVisitCooldown(userIdx, nfc.placeIdx, nfc.cooldown);

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

  private async validatePlaceVisitCooldown(
    userIdx: number,
    placeIdx: number,
    cooldown: number,
  ): Promise<void> {
    if (cooldown === 0) {
      return;
    }

    const [latestPlaceVisit] =
      await this.placeVisitCoreService.getPlaceVisitAll({
        userIdx,
        placeIdx,
        take: 1,
        skip: 0,
        order: 'desc',
      });
    if (!latestPlaceVisit) {
      return;
    }

    const cooldownEndsAt =
      latestPlaceVisit.createdAt.getTime() + cooldown * 1000;
    const remainingMilliseconds = cooldownEndsAt - Date.now();
    if (remainingMilliseconds <= 0) {
      return;
    }

    throw new ConflictException({
      message: 'NFC cooldown is active',
    });
  }

  private readKey(configService: ConfigService, name: string): Buffer {
    const value = configService.getOrThrow<string>(name);

    if (!/^[0-9a-fA-F]{32}$/.test(value)) {
      throw new Error(`${name} must be a 16-byte hexadecimal value`);
    }

    return Buffer.from(value, 'hex');
  }
}
