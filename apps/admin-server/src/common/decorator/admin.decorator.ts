import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginAdmin } from '../types/login-admin';

/**
 * access token 에서 decode 한 관리자 정보를 가져오는 데코레이터
 */
export const Admin = createParamDecorator(
  (data: never, ctx: ExecutionContext): LoginAdmin => {
    const request = ctx.switchToHttp().getRequest();

    return {
      idx: request.admin?.idx,
      role: request.admin?.role,
    };
  },
);
