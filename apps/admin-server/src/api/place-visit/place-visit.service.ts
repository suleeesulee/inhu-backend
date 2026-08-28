import { LeagueSeasonResultModel } from '@libs/core/league-season/model/league-season-result.model';
import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { PlaceVisitCoreService } from '@libs/core/place-visit/place-visit-core.service';
import { UserRewardCoreService } from '@libs/core/user-reward/user-reward-core.service';
import { Transactional } from '@nestjs-cls/transactional';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PlaceVisitService {
  constructor(
    private readonly placeVisitCoreService: PlaceVisitCoreService,
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
    private readonly userRewardCoreService: UserRewardCoreService,
  ) {}

  @Transactional()
  public async deletePlaceVisitById(id: string): Promise<void> {
    const placeVisit = await this.placeVisitCoreService.getPlaceVisitById(id);
    if (!placeVisit) {
      throw new NotFoundException('Place visit not found');
    }

    await this.placeVisitCoreService.deletePlaceVisitById(id);

    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByDateTime(
        placeVisit.createdAt,
      );
    if (!leagueSeason?.finalizedAt) {
      return;
    }

    const leagueSeasonResult =
      await this.leagueSeasonCoreService.getLeagueSeasonResultByLeagueSeasonIdxAndUserIdx(
        leagueSeason.idx,
        placeVisit.userIdx,
      );
    if (!leagueSeasonResult) {
      return;
    }

    const finalScore =
      await this.placeVisitCoreService.getPlaceVisitScoreByUserIdxAndDatePeriod(
        placeVisit.userIdx,
        leagueSeason.startAt,
        leagueSeason.endAt,
      );

    await this.leagueSeasonCoreService.updateLeagueSeasonResultById(
      leagueSeasonResult.id,
      { finalScore },
    );

    await this.synchronizeUnselectedUserRewardAllByLeagueSeasonIdx(
      leagueSeason.idx,
    );
  }

  private async synchronizeUnselectedUserRewardAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(leagueSeasonIdx);
    if (!leagueSeason) {
      throw new NotFoundException('League season not found');
    }

    const [leagueSeasonResultList, userRankingList] = await Promise.all([
      this.leagueSeasonCoreService.getLeagueSeasonResultAllByLeagueSeasonIdx(
        leagueSeasonIdx,
      ),
      this.leagueSeasonCoreService.getLeagueSeasonResultUserRankingAllByLeagueSeasonIdx(
        leagueSeasonIdx,
      ),
    ]);

    const leagueSeasonResultByUserIdx = new Map<
      number,
      LeagueSeasonResultModel
    >(
      leagueSeasonResultList.map((leagueSeasonResult) => [
        leagueSeasonResult.userIdx,
        leagueSeasonResult,
      ]),
    );
    const rewardTargetRankSet = new Set(
      leagueSeason.rewardOptionList.map(({ targetRank }) => targetRank),
    );
    const eligibleLeagueSeasonResultIdSet = new Set(
      userRankingList.flatMap((userRanking) => {
        if (!rewardTargetRankSet.has(userRanking.seasonRank)) {
          return [];
        }

        const leagueSeasonResult = leagueSeasonResultByUserIdx.get(
          userRanking.userIdx,
        );
        return leagueSeasonResult ? [leagueSeasonResult.id] : [];
      }),
    );
    const leagueSeasonResultIdList = leagueSeasonResultList.map(({ id }) => id);
    const userRewardList =
      await this.userRewardCoreService.getUserRewardAllByLeagueSeasonResultIdList(
        leagueSeasonResultIdList,
      );
    const userRewardLeagueSeasonResultIdSet = new Set(
      userRewardList.map(({ leagueSeasonResultId }) => leagueSeasonResultId),
    );

    await this.userRewardCoreService.deleteUnselectedUserRewardAllByLeagueSeasonResultIdList(
      leagueSeasonResultIdList.filter(
        (leagueSeasonResultId) =>
          !eligibleLeagueSeasonResultIdSet.has(leagueSeasonResultId),
      ),
    );

    for (const leagueSeasonResultId of eligibleLeagueSeasonResultIdSet) {
      if (userRewardLeagueSeasonResultIdSet.has(leagueSeasonResultId)) {
        continue;
      }

      await this.userRewardCoreService.createUserReward({
        leagueSeasonResultId,
        rewardIdx: null,
        selectedAt: null,
        issuedAt: null,
      });
    }
  }
}
