export class CreateLeagueSeasonInput {
  name: string;
  startAt: string;
  endAt: string;
  activatedAt: Date | null;
  rewardOptionList: {
    rewardIdx: number;
    targetRank: number;
  }[];
}
