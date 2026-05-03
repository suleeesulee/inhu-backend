import { CafeteriaCoreModule } from '@libs/core/cafeteria/cafeteria-core.module';
import { Module } from '@nestjs/common';
import { CafeteriaController } from './cafeteria.controller';
import { CafeteriaService } from './cafeteria.service';

@Module({
  imports: [CafeteriaCoreModule],
  controllers: [CafeteriaController],
  providers: [CafeteriaService],
})
export class CafeteriaModule {}
