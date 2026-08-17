import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { LeagueSeasonResultCronService } from './league-season-result-cron.service';

@Injectable()
export class LeagueSeasonResultCronSchedule {
  constructor(
    private readonly leagueSeasonResultCronService: LeagueSeasonResultCronService,
  ) {}

  @Cron('*/2 * * * *')
  public async leagueSeasonResultCronJob(): Promise<void> {
    await this.leagueSeasonResultCronService.finalizeLeagueSeasonResultAll();
  }
}
