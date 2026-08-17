import { Module } from '@nestjs/common';
import { InstallationLifecycleCoreService } from './installation-lifecycle-core.service';
import { InstallationLifecycleCoreRepository } from './installation-lifecycle-core.repository';

/**
 * Installation Lifecycle 코어
 *
 * @publicApi
 */
@Module({
  imports: [],
  controllers: [],
  providers: [
    InstallationLifecycleCoreService,
    InstallationLifecycleCoreRepository,
  ],
  exports: [InstallationLifecycleCoreService],
})
export class InstallationLifecycleCoreModule {}
