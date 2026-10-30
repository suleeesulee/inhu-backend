import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { LeagueSeasonResultCronService } from './league-season-result-cron.service';

@Injectable()
export class LeagueSeasonResultCronSchedule {
  constructor(
    private readonly leagueSeasonResultCronService: LeagueSeasonResultCronService,
  ) {}

  @Cron('0 0 1 * * *', { timeZone: 'Asia/Seoul' })
  public async leagueSeasonResultCronJob(): Promise<void> {
    await this.leagueSeasonResultCronService.finalizeLeagueSeasonResultAll();
  }
}
