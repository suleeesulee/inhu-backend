import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { PlaceVisitService } from './place-visit.service';

@Controller('place-visit')
export class PlaceVisitController {
  constructor(private readonly placeVisitService: PlaceVisitService) {}

  /**
   * 특정 방문 인증 삭제
   */
  @Delete('/:id')
  @AdminAuth()
  @Exception(400, 'Invalid place visit id')
  @Exception(404, 'Place visit not found')
  public async deletePlaceVisitById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.placeVisitService.deletePlaceVisitById(id);
  }
}
