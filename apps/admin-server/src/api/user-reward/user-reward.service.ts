import { Locker } from '@libs/common/decorator/locker.decorator';
import { MailService } from '@libs/common/modules/mail/mail.service';
import { UserCoreService } from '@libs/core/user/user-core.service';
import { UserRewardCoreService } from '@libs/core/user-reward/user-reward-core.service';
import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { RewardCoreService } from '@libs/core/reward/reward-core.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetUserRewardAllDto } from './dto/request/get-user-reward-all.dto';
import { GetUserRewardAllResponseDto } from './dto/response/get-user-reward-all.response.dto';
import { UserRewardEntity } from './entity/user-reward.entity';
import { IssueUserRewardDto } from './dto/request/issue-user-reward.dto';
import { S3Service } from '@libs/common/modules/s3/s3.service';
import { userRewardIssueTemplate } from './user-reward-issue.template';

@Injectable()
export class UserRewardService {
  constructor(
    private readonly userRewardCoreService: UserRewardCoreService,
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
    private readonly userCoreService: UserCoreService,
    private readonly rewardCoreService: RewardCoreService,
    private readonly mailService: MailService,
    private readonly s3Service: S3Service,
  ) {}

  public async getUserRewardAll(
    dto: GetUserRewardAllDto,
  ): Promise<GetUserRewardAllResponseDto> {
    const pageSize = 10;
    const input = {
      take: pageSize,
      skip: (dto.page - 1) * pageSize,
      status: dto.status,
      order: dto.order,
      leagueSeasonIdx: dto.leagueSeasonIdx,
    };
    const [userRewardList, count] = await Promise.all([
      this.userRewardCoreService.getUserRewardAll(input),
      this.userRewardCoreService.getUserRewardCount(input),
    ]);
    const leagueSeasonResultList =
      await this.leagueSeasonCoreService.getLeagueSeasonResultAllByIdList(
        userRewardList.map((userReward) => userReward.leagueSeasonResultId),
      );
    const leagueSeasonResultMap = new Map(
      leagueSeasonResultList.map((leagueSeasonResult) => [
        leagueSeasonResult.id,
        leagueSeasonResult,
      ]),
    );
    const [userList, rewardList] = await Promise.all([
      this.userCoreService.getUserAllByIdxList(
        leagueSeasonResultList.map(
          (leagueSeasonResult) => leagueSeasonResult.userIdx,
        ),
      ),
      this.rewardCoreService.getRewardAllByIdxList(
        userRewardList.flatMap((userReward) =>
          userReward.rewardIdx === null ? [] : [userReward.rewardIdx],
        ),
      ),
    ]);
    const userMap = new Map(userList.map((user) => [user.idx, user]));
    const rewardMap = new Map(rewardList.map((reward) => [reward.idx, reward]));

    return {
      count,
      userRewardList: userRewardList.map((userReward) => {
        const leagueSeasonResult = leagueSeasonResultMap.get(
          userReward.leagueSeasonResultId,
        );
        if (!leagueSeasonResult) {
          throw new NotFoundException('League season result not found');
        }

        const user = userMap.get(leagueSeasonResult.userIdx);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const reward = userReward.rewardIdx
          ? (rewardMap.get(userReward.rewardIdx) ?? null)
          : null;
        if (userReward.rewardIdx && !reward) {
          throw new NotFoundException('Reward not found');
        }

        return UserRewardEntity.fromModel(
          userReward,
          leagueSeasonResult,
          user,
          reward,
        );
      }),
    };
  }

  public async getUserRewardById(id: string): Promise<UserRewardEntity> {
    const userReward = await this.userRewardCoreService.getUserRewardById(id);
    if (!userReward) {
      throw new NotFoundException('User reward not found');
    }

    const leagueSeasonResult =
      await this.leagueSeasonCoreService.getLeagueSeasonResultById(
        userReward.leagueSeasonResultId,
      );
    if (!leagueSeasonResult) {
      throw new NotFoundException('League season result not found');
    }

    const [user, reward] = await Promise.all([
      this.userCoreService.getUserByIdx(leagueSeasonResult.userIdx),
      userReward.rewardIdx
        ? this.rewardCoreService.getRewardByIdx(userReward.rewardIdx)
        : null,
    ]);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (userReward.rewardIdx && !reward) {
      throw new NotFoundException('Reward not found');
    }

    return UserRewardEntity.fromModel(
      userReward,
      leagueSeasonResult,
      user,
      reward,
    );
  }

  @Locker({
    key: (id: string) => `user-reward:${id}:issuance`,
  })
  public async issueUserRewardById(
    id: string,
    dto: IssueUserRewardDto,
  ): Promise<void> {
    const userReward = await this.userRewardCoreService.getUserRewardById(id);
    if (!userReward) {
      throw new NotFoundException('User reward not found');
    }
    if (userReward.issuedAt) {
      throw new ConflictException('User reward has already been issued');
    }
    if (!userReward.selectedAt || !userReward.rewardIdx) {
      throw new ConflictException('User has not selected a reward');
    }

    const leagueSeasonResult =
      await this.leagueSeasonCoreService.getLeagueSeasonResultById(
        userReward.leagueSeasonResultId,
      );
    if (!leagueSeasonResult) {
      throw new NotFoundException('League season result not found');
    }

    const [user, reward] = await Promise.all([
      this.userCoreService.getUserByIdx(leagueSeasonResult.userIdx),
      this.rewardCoreService.getRewardByIdx(userReward.rewardIdx),
    ]);
    if (!user?.schoolEmail) {
      throw new ForbiddenException('User school email not found');
    }
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    dto.imagePathList.forEach((imagePath) =>
      this.validateUserRewardImagePath(imagePath),
    );
    const imageDataUrlList = await Promise.all(
      dto.imagePathList.map(async (imagePath) => {
        const image = await this.s3Service.getPrivateFile(imagePath);
        if (!image) {
          throw new NotFoundException('User reward image not found');
        }
        const contentType = this.getUserRewardImageContentType(image);
        if (!contentType) {
          throw new BadRequestException('Invalid user reward image type');
        }
        if (image.byteLength > 5 * 1024 * 1024) {
          throw new BadRequestException('User reward image is too large');
        }

        return `data:${contentType};base64,${image.toString('base64')}`;
      }),
    );

    await this.mailService.sendMail(
      user.schoolEmail,
      `[인하밥길] ${leagueSeasonResult.leagueSeason.name} 리워드 발급 안내`,
      userRewardIssueTemplate(
        user.nickname,
        leagueSeasonResult.leagueSeason.name,
        reward.name,
        dto.content,
        imageDataUrlList,
      ),
    );
    // await this.userRewardCoreService.updateUserRewardById(id, {
    //   issuedAt: new Date(),
    // });
  }

  private validateUserRewardImagePath(imagePath: string): void {
    const pattern = new RegExp(
      '^/user-reward/' +
        '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-' +
        '[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.(jpg|jpeg|png|webp)$',
      'i',
    );

    if (!pattern.test(imagePath)) {
      throw new BadRequestException('Invalid user reward image path');
    }
  }

  private getUserRewardImageContentType(content: Buffer): string | null {
    const pngSignature = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    if (content.subarray(0, pngSignature.length).equals(pngSignature)) {
      return 'image/png';
    }

    const jpegSignature = Buffer.from([0xff, 0xd8, 0xff]);
    if (content.subarray(0, jpegSignature.length).equals(jpegSignature)) {
      return 'image/jpeg';
    }

    const webpSignature = Buffer.from('WEBP');
    if (
      content.subarray(0, 4).toString() === 'RIFF' &&
      content.subarray(8, 12).equals(webpSignature)
    ) {
      return 'image/webp';
    }

    return null;
  }
}
