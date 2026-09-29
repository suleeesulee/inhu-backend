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
import { PlaceVisitByNfcTestDto } from './dto/request/place-visit-by-nfc-test.dto';
import { NfcModel } from '@libs/core/nfc/model/nfc.model';
import { RedisService } from '@libs/common/modules/redis/redis.service';

@Injectable()
export class PlaceVisitService {
  private readonly masterKey: Buffer;
  private readonly defaultCooldownSeconds: number;

  constructor(
    private readonly placeVisitCoreService: PlaceVisitCoreService,
    private readonly nfcCoreService: NfcCoreService,
    private readonly redisService: RedisService,
    configService: ConfigService,
  ) {
    this.masterKey = this.readKey(configService, 'nfc.masterKey');
    this.defaultCooldownSeconds = configService.getOrThrow<number>(
      'nfc.defaultCooldownSeconds',
    );
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
    const nfc = await this.validateNfc(dto);

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

  public async placeVisitByNfcTest(
    userIdx: number,
    dto: PlaceVisitByNfcTestDto,
  ): Promise<void> {
    const nfc = await this.validateNfc(dto);

    await this.validatePlaceVisitTestCooldown(
      userIdx,
      nfc.placeIdx,
      nfc.cooldown,
    );
  }

  private async validateNfc(dto: PlaceVisitByNfcTestDto): Promise<NfcModel> {
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

    return nfc;
  }

  private async validatePlaceVisitCooldown(
    userIdx: number,
    placeIdx: number,
    cooldown: number | null,
  ): Promise<void> {
    const appliedCooldown =
      cooldown === null ? this.defaultCooldownSeconds : cooldown;
    if (appliedCooldown === 0) {
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
      latestPlaceVisit.createdAt.getTime() + appliedCooldown * 1000;
    const remainingMilliseconds = cooldownEndsAt - Date.now();
    if (remainingMilliseconds <= 0) {
      return;
    }

    throw new ConflictException(
      `NFC cooldown is active. ${Math.ceil(remainingMilliseconds / 1000)} seconds remaining`,
    );
  }

  private async validatePlaceVisitTestCooldown(
    userIdx: number,
    placeIdx: number,
    cooldown: number | null,
  ): Promise<void> {
    const appliedCooldown =
      cooldown === null ? this.defaultCooldownSeconds : cooldown;
    if (appliedCooldown === 0) {
      return;
    }

    const key = `place-visit-test-cooldown:${userIdx}:${placeIdx}`;

    while (true) {
      const result = await this.redisService.set(
        key,
        '1',
        'EX',
        appliedCooldown,
        'NX',
      );
      if (result === 'OK') {
        return;
      }

      const remainingSeconds = await this.redisService.ttl(key);
      if (remainingSeconds > 0) {
        throw new ConflictException(
          `NFC cooldown is active. ${remainingSeconds} seconds remaining`,
        );
      }
    }
  }

  private readKey(configService: ConfigService, name: string): Buffer {
    const value = configService.getOrThrow<string>(name);

    if (!/^[0-9a-fA-F]{32}$/.test(value)) {
      throw new Error(`${name} must be a 16-byte hexadecimal value`);
    }

    return Buffer.from(value, 'hex');
  }
}
