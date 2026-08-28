import { Injectable } from '@nestjs/common';
import { NfcCoreRepository } from './nfc-core.repository';
import { NfcModel } from './model/nfc.model';
import { CreateNfcInput } from './inputs/create-nfc.input';
import { UpdateNfcInput } from './inputs/update-nfc.input';
import { GetNfcAllInput } from './inputs/get-nfc-all.input';

@Injectable()
export class NfcCoreService {
  constructor(private readonly nfcCoreRepository: NfcCoreRepository) {}

  public async getNfcByIdx(idx: number): Promise<NfcModel | null> {
    const nfc = await this.nfcCoreRepository.selectNfcByIdx(idx);
    return nfc && NfcModel.fromPrisma(nfc);
  }

  public async getNfcByUid(uid: string): Promise<NfcModel | null> {
    const nfc = await this.nfcCoreRepository.selectNfcByUid(uid);
    return nfc && NfcModel.fromPrisma(nfc);
  }

  public async getNfcAll(input: GetNfcAllInput): Promise<NfcModel[]> {
    return (await this.nfcCoreRepository.selectNfcAll(input)).map(
      NfcModel.fromPrisma,
    );
  }

  public async getNfcCount(input: GetNfcAllInput): Promise<number> {
    return await this.nfcCoreRepository.selectNfcCount(input);
  }

  public async createNfc(input: CreateNfcInput): Promise<NfcModel> {
    return NfcModel.fromPrisma(await this.nfcCoreRepository.insertNfc(input));
  }

  public async updateNfcByIdx(
    idx: number,
    input: UpdateNfcInput,
  ): Promise<void> {
    await this.nfcCoreRepository.updateNfcByIdx(idx, input);
  }

  public async deleteNfcByIdx(idx: number): Promise<void> {
    await this.nfcCoreRepository.softDeleteNfcByIdx(idx);
  }
}
