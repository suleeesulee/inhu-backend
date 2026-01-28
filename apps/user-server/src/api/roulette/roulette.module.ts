import { Module } from '@nestjs/common';
import { RouletteController } from './roulette.controller';
import { RouletteService } from './roulette.service';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';
import { ConfigModule } from '@nestjs/config';
import rouletteConfig from './config/roulette.config';

@Module({
  imports: [PlaceCoreModule, ConfigModule.forFeature(rouletteConfig)],
  controllers: [RouletteController],
  providers: [RouletteService],
  exports: [RouletteService],
})
export class RouletteModule {}
