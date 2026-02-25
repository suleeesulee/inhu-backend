import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PinnedMagazineService } from './pinned-magazine.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { PinMagazineByIdxDto } from './dto/request/pin-magazine-by-idx.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminRole } from '../auth/admin-role.enum';
import { Admin } from '@admin/common/decorator/admin.decorator';
import { LoginAdmin } from '@admin/common/types/login-admin';

@Controller()
@ApiTags('Pinned Magazine')
export class PinnedMagazineController {
  constructor(private readonly pinnedMagazineService: PinnedMagazineService) {}

  /**
   * 매거진 고정/고정해제
   *
   * @author 이수인
   */
  @AdminAuth(AdminRole.MagazineAdmin)
  @Post('/magazine/:idx/pin')
  @Exception(400, 'Invalid magazine idx')
  @Exception(403, 'Admin is not the author of the magazine')
  @Exception(404, 'Magazine not found')
  @Exception(
    409,
    `- pin: true - Magazine is already pinned
     - pin: false - Magazine is not pinned`,
  )
  @HttpCode(200)
  public async pinMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: PinMagazineByIdxDto,
    @Admin() admin: LoginAdmin,
  ): Promise<void> {
    return await this.pinnedMagazineService.pinMagazineByIdx(idx, dto, admin);
  }
}
