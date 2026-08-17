import { IsIn, IsOptional, IsString } from 'class-validator';

export class RegisterInstallationLifecycleDto {
  @IsString()
  installationId: string;

  @IsString()
  @IsOptional()
  refreshToken: string | null = null;

  @IsString()
  appVersion: string;

  /**
   * 플랫폼
   */
  @IsString()
  @IsIn(['ios', 'android'])
  platform: 'ios' | 'android';

  @IsString()
  @IsOptional()
  pushNotificationToken: string | null = null;
}
