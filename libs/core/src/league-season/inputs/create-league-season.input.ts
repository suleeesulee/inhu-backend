export class CreateLeagueSeasonInput {
  name: string;
  startAt: string;
  endAt: string;
  rewardOptionList: {
    rewardIdx: number;
    targetRank: number;
  }[];
}
