import { Module } from '@nestjs/common';
import { InstallationLifecycleController } from './installation-lifecycle.controller';
import { InstallationLifecycleService } from './installation-lifecycle.service';
import { InstallationLifecycleCoreModule } from '@libs/core/installation-lifecycle/installation-lifecycle-core.module';

@Module({
  imports: [InstallationLifecycleCoreModule],
  controllers: [InstallationLifecycleController],
  providers: [InstallationLifecycleService],
})
export class InstallationLifecycleModule {}
