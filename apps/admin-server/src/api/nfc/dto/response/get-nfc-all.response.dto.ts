import { NfcEntity } from '../../entity/nfc.entity';

export class GetNfcAllResponseDto {
  public count: number;
  public nfcList: NfcEntity[];
}
