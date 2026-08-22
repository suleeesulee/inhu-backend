import { NfcEntity } from '../../entity/nfc.entity';

export class GetNfcAllResponseDto {
  public hasNext: boolean;
  public nfcList: NfcEntity[];
}
