import { Module } from '@nestjs/common';
import { InstallationLifecycleController } from './installation-lifecycle.controller';
import { InstallationLifecycleService } from './installation-lifecycle.service';
import { InstallationLifecycleCoreModule } from '@libs/core/installation-lifecycle/installation-lifecycle-core.module';
import { PushTokenCoreModule } from '@libs/core/push-notification/push-token-core.module';

@Module({
  imports: [InstallationLifecycleCoreModule, PushTokenCoreModule],
  controllers: [InstallationLifecycleController],
  providers: [InstallationLifecycleService],
})
export class InstallationLifecycleModule {}
