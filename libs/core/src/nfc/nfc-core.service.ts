import { Injectable } from '@nestjs/common';
import { NfcCoreRepository } from './nfc-core.repository';

@Injectable()
export class NfcCoreService {
  constructor(private readonly nfcCoreRepository: NfcCoreRepository) {}
}
