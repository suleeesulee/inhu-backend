import { NfcCoreService } from '@libs/core/nfc/nfc-core.service';
import { Prisma } from '@prisma/client';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NfcEntity } from './entity/nfc.entity';
import { CreateNfcDto } from './dto/request/create-nfc.dto';
import { UpdateNfcDto } from './dto/request/update-nfc.dto';

@Injectable()
export class NfcService {
  constructor(private readonly nfcCoreService: NfcCoreService) {}

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
      });
    } catch (error) {
      this.throwIfUidDuplicated(error, dto.uid);
      throw error;
    }
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
}
