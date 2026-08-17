import { Body, Controller, Post } from '@nestjs/common';
import { InstallationLifecycleService } from './installation-lifecycle.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterInstallationLifecycleDto } from './dto/request/register-installation-lifecycle.dto';
import { Exception } from '@libs/common/decorator/exception.decorator';

@Controller('installation-lifecycle')
@ApiTags('InstallationLifecycle')
export class InstallationLifecycleController {
  constructor(
    private readonly installationLifecycleService: InstallationLifecycleService,
  ) {}

  @Post()
  @Exception(400, 'fail to validate DTO')
  @Exception(401, 'invalid refresh token')
  public async registerInstallationLifecycle(
    @Body() dto: RegisterInstallationLifecycleDto,
  ): Promise<void> {
    await this.installationLifecycleService.registerLifecycle(dto);
  }
}
