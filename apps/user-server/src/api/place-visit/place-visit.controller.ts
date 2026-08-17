import { Exception } from '@libs/common/decorator/exception.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { PlaceVisitEntity } from './entity/place-visit.entity';
import { PlaceVisitService } from './place-visit.service';
import { CreatePlaceVisitByNfcDto } from './dto/request/create-place-visit-by-nfc.dto';

@Controller('place-visit')
export class PlaceVisitController {
  constructor(private readonly placeVisitService: PlaceVisitService) {}

  /**
   * NFC 방문 인증
   */
  @Post('nfc')
  @LoginAuth()
  @Exception(400, 'Invalid NFC payload')
  @Exception(403, 'NFC is inactive or SDM MAC is invalid')
  @Exception(404, 'NFC not found')
  public async createPlaceVisitByNfc(
    @Body() dto: CreatePlaceVisitByNfcDto,
    @User() user: LoginUser,
  ): Promise<PlaceVisitEntity> {
    return await this.placeVisitService.createPlaceVisitByNfc(user.idx, dto);
  }
}
