import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.input';

/**
 * 사용자 업데이트 입력 input
 *
 * @publicApi
 */
export class UpdateUserInput extends PartialType(
  PickType(CreateUserInput, ['nickname', 'profileImagePath']),
) {
  /**
   * 학교 이메일
   */
  schoolEmail?: string;

  /**
   * 학교 인증 여부
   */
  isSchoolVerified?: boolean;
}
