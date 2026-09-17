import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { KAFKA_CLIENT } from './constants/kafka.constants';

/**
 * Kafka 이벤트 발행 서비스
 *
 * @publicApi
 */
@Injectable()
export class KafkaProducerService implements OnModuleDestroy {
  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly client: ClientKafka,
  ) {}

  /**
   * @example
   * await kafkaProducerService.emit(topic, { campaignId });
   */
  public async emit<T>(topic: string, event: T): Promise<void> {
    await lastValueFrom(this.client.emit(topic, event));
  }

  public async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
