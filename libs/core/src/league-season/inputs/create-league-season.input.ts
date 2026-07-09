export class CreateLeagueSeasonInput {
  name: string;
  startAt: Date;
  endAt: Date;
  rewardOptionList: {
    rewardIdx: number;
    targetRank: number;
  }[];
}
