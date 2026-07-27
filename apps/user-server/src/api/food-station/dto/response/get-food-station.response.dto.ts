import { DailyMemoEntity } from '../../entity/daily-memo.entity';
import { FoodStationEntity } from '../../entity/food-station.entity';

export class GetFoodStationResponseDto {
  foodStationList: FoodStationEntity[];
  dailyMemo: DailyMemoEntity | null;
}
