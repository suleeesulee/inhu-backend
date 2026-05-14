import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PinMagazineByIdxDto } from './dto/request/pin-magazine-by-idx.dto';
import { PinnedMagazineCoreService } from '@libs/core/pinned-magazine/pinned-magazine-core.service';
import { LoginAdmin } from '@admin/common/types/login-admin';
import { AdminRole } from '../auth/admin-role.enum';

@Injectable()
export class PinnedMagazineService {
  constructor(
    private readonly magazineCoreService: MagazineCoreService,
    private readonly pinnedMagazineCoreService: PinnedMagazineCoreService,
  ) {}

  public async pinMagazineByIdx(
    idx: number,
    dto: PinMagazineByIdxDto,
    admin: LoginAdmin,
  ): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    // if (
    //   admin.role === AdminRole.MagazineAdmin &&
    //   magazine.authorIdx !== admin.idx
    // ) {
    //   throw new ForbiddenException(
    //     `Admin idx: ${admin.idx} is not the author of magazine idx: ${idx}`,
    //   );
    // }

    const pinnedMagazine =
      await this.pinnedMagazineCoreService.getPinnedMagazineByIdx(idx);
    const isPin = dto.pinned;
    if (isPin && pinnedMagazine) {
      throw new ConflictException(`Magazine is already pinned: ${idx}`);
    }
    if (!isPin && !pinnedMagazine) {
      throw new ConflictException(`Magazine is not pinned: ${idx}`);
    }

    if (isPin) {
      await this.pinnedMagazineCoreService.createPinnedMagazineByIdx(idx);
    } else {
      await this.pinnedMagazineCoreService.deletePinnedMagazineByIdx(idx);
    }
  }
}
