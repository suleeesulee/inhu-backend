export class GetLeagueSeasonResultAllInput {
  public take: number;
  public skip: number;
  public order?: 'asc' | 'desc';
  public activated?: boolean;
}
