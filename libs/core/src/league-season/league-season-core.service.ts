import { Injectable } from '@nestjs/common';
import { LeagueSeasonCoreRepository } from './league-season-core.repository';

@Injectable()
export class LeagueSeasonCoreService {
  constructor(
    private readonly leagueSeasonCoreRepository: LeagueSeasonCoreRepository,
  ) {}
}
