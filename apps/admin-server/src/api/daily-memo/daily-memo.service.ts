import { DailyMemoCoreService } from '@libs/core/daily-memo/daily-memo-core.service';
import { Injectable } from '@nestjs/common';
import { GetDailyMemoAllDto } from './dto/request/get-daily-memo-all.dto';
import { DailyMemoEntity } from './entity/daily-memo.entity';
import { CreateDailyMemoDto } from './dto/request/create-daily-memo.dto';
import { UpdateDailyMemoDto } from './dto/request/update-daily-memo.dto';

@Injectable()
export class DailyMemoService {
  constructor(private readonly dailyMemoCoreService: DailyMemoCoreService) {}

  public async getDailyMemoAll(
    cafeteriaIdx: number,
    dto: GetDailyMemoAllDto,
  ): Promise<DailyMemoEntity[]> {
    return (
      await this.dailyMemoCoreService.selectDailyMemoAll({
        cafeteriaIdx,
        ...dto,
      })
    ).map(DailyMemoEntity.fromModel);
  }

  public async createDailyMemo(
    cafeteriaIdx: number,
    dto: CreateDailyMemoDto,
  ): Promise<DailyMemoEntity> {
    return DailyMemoEntity.fromModel(
      await this.dailyMemoCoreService.createDailyMemo({ cafeteriaIdx, ...dto }),
    );
  }

  public async updateDailyMemoByIdx(
    idx: number,
    dto: UpdateDailyMemoDto,
  ): Promise<void> {
    const dailyMemo = await this.dailyMemoCoreService.selectDailyMemoByIdx(idx);
    if (!dailyMemo) {
      throw new Error('Daily memo does not exist');
    }

    await this.dailyMemoCoreService.updateDailyMemoByIdx(idx, dto);
  }

  public async deleteDailyMemoByIdx(idx: number): Promise<void> {
    const dailyMemo = await this.dailyMemoCoreService.selectDailyMemoByIdx(idx);
    if (!dailyMemo) {
      throw new Error('Daily memo does not exist');
    }

    await this.dailyMemoCoreService.deleteDailyMemoByIdx(idx);
  }
}
