import { UserRewardStatus } from '../constants/user-reward-status.enum';

export class GetUserRewardInput {
  public take?: number;
  public skip?: number;

  public status?: UserRewardStatus;
  public order?: 'asc' | 'desc';
  public leagueSeasonIdx?: number;
}
