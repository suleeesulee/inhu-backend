import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { NfcService } from './nfc.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { CreateNfcDto } from './dto/request/create-nfc.dto';
import { NfcEntity } from './entity/nfc.entity';
import { UpdateNfcDto } from './dto/request/update-nfc.dto';

@Controller()
export class NfcController {
  constructor(private readonly nfcService: NfcService) {}

  /**
   * nfc 단건 조회
   */
  @Get('nfc/:idx')
  @AdminAuth()
  @Exception(404, 'Nfc not found')
  public async getNfcByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<NfcEntity> {
    return await this.nfcService.getNfcByIdx(idx);
  }

  /**
   * 장소의 모든 nfc 조회
   */
  @Get('place/:placeIdx/nfc')
  @AdminAuth()
  public async getNfcAllByPlaceIdx(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
  ): Promise<NfcEntity[]> {
    return await this.nfcService.getNfcAllByPlaceIdx(placeIdx);
  }

  /**
   * nfc 생성
   */
  @Post('place/:placeIdx/nfc')
  @AdminAuth()
  @Exception(400, 'Invalid nfc creation request')
  @Exception(409, 'Nfc uid already exists')
  public async createNfc(
    @Param('placeIdx', ParseIntPipe) placeIdx: number,
    @Body() dto: CreateNfcDto,
  ): Promise<NfcEntity> {
    return await this.nfcService.createNfcByPlaceIdx(placeIdx, dto);
  }

  /**
   * nfc 수정
   */
  @Put('nfc/:idx')
  @AdminAuth()
  @Exception(400, 'Invalid nfc update request')
  @Exception(404, 'Nfc not found')
  @Exception(409, 'Nfc uid already exists')
  public async updateNfcByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() dto: UpdateNfcDto,
  ): Promise<void> {
    return await this.nfcService.updateNfcByIdx(idx, dto);
  }

  /**
   * nfc 활성화
   */
  @Post('nfc/:idx/activate')
  @AdminAuth()
  @Exception(404, 'Nfc not found')
  @Exception(409, 'Nfc already activated')
  public async activateNfcByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.nfcService.activateNfcByIdx(idx);
  }

  /**
   * nfc 비활성화
   */
  @Post('nfc/:idx/deactivate')
  @Exception(404, 'Nfc not found')
  @Exception(409, 'Nfc not activated')
  @AdminAuth()
  public async deactivateNfcByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.nfcService.deactivateNfcByIdx(idx);
  }

  /**
   * nfc 삭제
   */
  @Delete('nfc/:idx')
  @AdminAuth()
  @Exception(404, 'Nfc not found')
  public async deleteNfcByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    return await this.nfcService.deleteNfcByIdx(idx);
  }
}
