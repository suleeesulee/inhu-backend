import { KAFKA_CLIENT } from '@libs/common/modules/kafka/constants/kafka.constants';
import { KafkaModuleOptions } from '@libs/common/modules/kafka/interfaces/kafka-module-options.interface';
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka-producer.service';

/**
 * Kafka Producer 공통 모듈
 *
 * @example
 * KafkaModule.register({
 *   clientId: 'admin-server',
 *   brokers: [process.env.KAFKA_HOST!],
 * })
 *
 * @publicApi
 */
@Module({})
export class KafkaModule {
  public static register(options: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          {
            name: KAFKA_CLIENT,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: options.clientId,
                brokers: options.brokers,
              },
              producerOnlyMode: true,
            },
          },
        ]),
      ],
      providers: [KafkaProducerService],
      exports: [KafkaProducerService],
    };
  }
}
