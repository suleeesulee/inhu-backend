import { Controller, Get, Query } from '@nestjs/common';
import { RouletteService } from './roulette.service';
import { GetRouletteItemDto } from './dto/request/get-roulette-item.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Roulette')
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  @Get('roulette-item')
  public async getRouletteItem(@Query() dto: GetRouletteItemDto) {
    return await this.rouletteService.getRouletteItem(dto);
  }
}
