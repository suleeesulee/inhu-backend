import { NfcCoreService } from '@libs/core/nfc/nfc-core.service';
import { Prisma } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NfcEntity } from './entity/nfc.entity';
import { CreateNfcDto } from './dto/request/create-nfc.dto';
import { UpdateNfcDto } from './dto/request/update-nfc.dto';
import { ConfigService } from '@nestjs/config';
import {
  decryptNfcPiccData,
  deriveNfcAesKey,
  deriveNfcSessionMacKey,
  verifyNfcMac,
} from '@libs/core/nfc/nfc-crypto';
import { IssueNfcAesKeyResponseDto } from './dto/response/issue-nfc-aes-key.response.dto';
import { VerifyNfcDto } from './dto/request/verify-nfc.dto';
import { VerifyNfcResponseDto } from './dto/response/verify-nfc.response.dto';

@Injectable()
export class NfcService {
  private readonly masterKey: Buffer;

  constructor(
    private readonly nfcCoreService: NfcCoreService,
    configService: ConfigService,
  ) {
    this.masterKey = this.readKey(configService, 'nfc.masterKey');
  }

  public async getNfcByIdx(idx: number): Promise<NfcEntity> {
    const nfc = await this.nfcCoreService.getNfcByIdx(idx);
    if (!nfc) {
      throw new NotFoundException(`Nfc with idx ${idx} not found`);
    }

    return NfcEntity.fromModel(nfc);
  }

  public async getNfcAllByPlaceIdx(placeIdx: number): Promise<NfcEntity[]> {
    return (await this.nfcCoreService.getNfcAllByPlaceIdx(placeIdx)).map(
      NfcEntity.fromModel,
    );
  }

  public async createNfcByPlaceIdx(
    placeIdx: number,
    dto: CreateNfcDto,
  ): Promise<NfcEntity> {
    try {
      return NfcEntity.fromModel(
        await this.nfcCoreService.createNfc({
          placeIdx,
          score: dto.score,
          uid: dto.uid,
          activatedAt: null,
        }),
      );
    } catch (error) {
      this.throwIfUidDuplicated(error, dto.uid);
      throw error;
    }
  }

  public async updateNfcByIdx(idx: number, dto: UpdateNfcDto): Promise<void> {
    const nfc = await this.nfcCoreService.getNfcByIdx(idx);
    if (!nfc) {
      throw new NotFoundException(`Nfc with idx ${idx} not found`);
    }

    try {
      await this.nfcCoreService.updateNfcByIdx(idx, {
        score: dto.score,
        uid: dto.uid,
        activatedAt: nfc.uid === dto.uid ? undefined : null,
      });
    } catch (error) {
      this.throwIfUidDuplicated(error, dto.uid);
      throw error;
    }
  }

  public async issueNfcAesKeyByIdx(
    idx: number,
  ): Promise<IssueNfcAesKeyResponseDto> {
    const nfc = await this.nfcCoreService.getNfcByIdx(idx);
    if (!nfc) {
      throw new NotFoundException(`Nfc with idx ${idx} not found`);
    }
    if (nfc.activatedAt) {
      throw new ConflictException('Activated nfc AES key cannot be issued');
    }

    const uid = Buffer.from(nfc.uid, 'hex');

    return {
      uid: nfc.uid,
      nfcAesKey: deriveNfcAesKey(this.masterKey, uid)
        .toString('hex')
        .toUpperCase(),
    };
  }

  public async verifyNfcByIdx(
    idx: number,
    dto: VerifyNfcDto,
  ): Promise<VerifyNfcResponseDto> {
    const nfc = await this.nfcCoreService.getNfcByIdx(idx);
    if (!nfc) {
      throw new NotFoundException(`Nfc with idx ${idx} not found`);
    }

    const expectedUid = Buffer.from(nfc.uid, 'hex');
    const nfcAesKey = deriveNfcAesKey(this.masterKey, expectedUid);

    let uid: Buffer;
    let readCounter: Buffer;

    try {
      ({ uid, readCounter } = decryptNfcPiccData(
        Buffer.from(dto.encryptedPiccData, 'hex'),
        nfcAesKey,
      ));
    } catch {
      throw new BadRequestException('Failed to decrypt NFC PICC data');
    }

    if (!uid.equals(expectedUid)) {
      throw new ConflictException('NFC UID does not match');
    }

    const sessionMacKey = deriveNfcSessionMacKey(nfcAesKey, uid, readCounter);

    if (!verifyNfcMac(sessionMacKey, Buffer.from(dto.sdmMac, 'hex'))) {
      throw new ForbiddenException('Invalid NFC MAC');
    }

    return {
      valid: true,
      uid: nfc.uid,
      readCounter: readCounter.readUIntLE(0, readCounter.length),
    };
  }

  public async activateNfcByIdx(idx: number): Promise<void> {
    const nfc = await this.nfcCoreService.getNfcByIdx(idx);
    if (!nfc) {
      throw new NotFoundException(`Nfc with idx ${idx} not found`);
    }

    if (nfc.activatedAt) {
      throw new ConflictException(`Nfc with idx ${idx} is already activated`);
    }

    await this.nfcCoreService.updateNfcByIdx(idx, {
      activatedAt: new Date(),
    });
  }

  public async deactivateNfcByIdx(idx: number): Promise<void> {
    const nfc = await this.nfcCoreService.getNfcByIdx(idx);
    if (!nfc) {
      throw new NotFoundException(`Nfc with idx ${idx} not found`);
    }

    if (!nfc.activatedAt) {
      throw new ConflictException(`Nfc with idx ${idx} is not activated`);
    }

    await this.nfcCoreService.updateNfcByIdx(idx, {
      activatedAt: null,
    });
  }

  public async deleteNfcByIdx(idx: number): Promise<void> {
    const nfc = await this.nfcCoreService.getNfcByIdx(idx);
    if (!nfc) {
      throw new NotFoundException(`Nfc with idx ${idx} not found`);
    }

    await this.nfcCoreService.deleteNfcByIdx(idx);
  }

  private throwIfUidDuplicated(error: unknown, uid: string): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(`Nfc with uid ${uid} already exists`);
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
