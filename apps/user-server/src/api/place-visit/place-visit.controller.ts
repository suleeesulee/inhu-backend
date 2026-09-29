import { Exception } from '@libs/common/decorator/exception.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { PlaceVisitEntity } from './entity/place-visit.entity';
import { PlaceVisitService } from './place-visit.service';
import { CreatePlaceVisitByNfcDto } from './dto/request/create-place-visit-by-nfc.dto';
import { GetPlaceVisitAllDto } from './dto/request/get-place-visit-all.dto';
import { GetPlaceVisitAllResponseDto } from './dto/response/get-place-visit-all.response.dto';
import { PlaceVisitByNfcTestDto } from './dto/request/place-visit-by-nfc-test.dto';

@Controller('place-visit')
export class PlaceVisitController {
  constructor(private readonly placeVisitService: PlaceVisitService) {}

  /**
   * 로그인 사용자 방문 인증 내역 조회
   * - 방문 기록 페이지에서 사용
   */
  @Get('all')
  @LoginAuth()
  @Exception(400, 'Invalid request')
  public async getPlaceVisitAll(
    @Query() dto: GetPlaceVisitAllDto,
    @User() user: LoginUser,
  ): Promise<GetPlaceVisitAllResponseDto> {
    return await this.placeVisitService.getPlaceVisitAllByUserIdx(
      dto,
      user.idx,
    );
  }

  /**
   * NFC 방문 인증
   * - NFC 태그 스캔 시 사용
   */
  @Post('nfc')
  @LoginAuth()
  @Exception(400, 'Invalid NFC payload')
  @Exception(403, 'NFC is inactive or SDM MAC is invalid')
  @Exception(404, 'NFC not found')
  @Exception(409, `NFC cooldown is active. xxx seconds remaining`)
  public async createPlaceVisitByNfc(
    @Body() dto: CreatePlaceVisitByNfcDto,
    @User() user: LoginUser,
  ): Promise<PlaceVisitEntity> {
    return await this.placeVisitService.createPlaceVisitByNfc(user.idx, dto);
  }

  @Post('nfc/test')
  @LoginAuth()
  @Exception(400, 'Invalid NFC payload')
  @Exception(403, 'NFC is inactive or SDM MAC is invalid')
  @Exception(404, 'NFC not found')
  @Exception(409, `NFC cooldown is active. xxx seconds remaining`)
  public async placeVisitByNfcTest(
    @Body() dto: PlaceVisitByNfcTestDto,
    @User() user: LoginUser,
  ): Promise<void> {
    await this.placeVisitService.placeVisitByNfcTest(user.idx, dto);
  }
}
