import { Body, Controller, Post } from '@nestjs/common';
import { InstallationLifecycleService } from './installation-lifecycle.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterInstallationLifecycleDto } from './dto/request/register-installation-lifecycle.dto';

@Controller('installation-lifecycle')
@ApiTags('InstallationLifecycle')
export class InstallationLifecycleController {
  constructor(
    private readonly installationLifecycleService: InstallationLifecycleService,
  ) {}

  @Post()
  public async registerInstallationLifecycle(
    @Body() dto: RegisterInstallationLifecycleDto,
  ): Promise<void> {
    await this.installationLifecycleService.registerLifecycle(dto);
  }
}
