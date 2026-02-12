import { User } from '../public-apis/types';

export const mockSendCode = (phone: string): Promise<void> =>
  new Promise((resolve) => {
    // always succeed after short delay
    setTimeout(resolve, 150);
  });

export const mockLogin = (phone: string, code: string): Promise<{ token: string; user: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === '123456') {
        const user: User = {
          phone,
          nickname: 'User_' + phone.slice(-4),
          avatar: '',
          token: 'token_' + phone,
        };
        resolve({ token: user.token, user });
      } else {
        reject(new Error('Invalid verification code'));
      }
    }, 150);
  });
};
