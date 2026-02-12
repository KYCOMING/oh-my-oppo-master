import { User } from '../public-apis/types';
import { mockLogin, mockSendCode } from '../mock/login-mock';

// 发送验证码
export async function sendVerifyCode(phone: string): Promise<void> {
  await mockSendCode(phone);
}

// 登录：返回 token 与 User
export async function login(phone: string, verifyCode: string): Promise<{ token: string; user: User }> {
  return mockLogin(phone, verifyCode);
}
