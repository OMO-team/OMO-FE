import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type {
  SignupRequest,
  LoginRequest,
  LoginResult,
  EmailSendRequest,
  EmailVerifyRequest,
  PasswordResetEmailRequest,
  PasswordResetVerifyRequest,
  PasswordResetRequest,
  GoogleSignupRequest,
  GoogleAuthorizationUrlResult,
  GoogleExchangeRequest,
  GoogleLoginResult,
} from '../types/dto';

export const authApi = {
  signup: (body: SignupRequest) => instance.post<ApiResponse<null>>('/api/v1/members/signup', body),

  login: async (body: LoginRequest) => {
    const { data } = await instance.post<ApiResponse<LoginResult>>('/auth/v1/login/local', body);
    localStorage.setItem('accessToken', data.result.accessToken);
    localStorage.setItem('refreshToken', data.result.refreshToken);
    return data;
  },

  logout: async () => {
    try {
      await instance.post('/auth/v1/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  sendEmailCode: (body: EmailSendRequest) =>
    instance.post<ApiResponse<null>>('/auth/v1/email/send', body),

  verifyEmailCode: (body: EmailVerifyRequest) =>
    instance.post<ApiResponse<null>>('/auth/v1/email/verify', body),

  sendPasswordResetEmail: (body: PasswordResetEmailRequest) =>
    instance.post<ApiResponse<null>>('/auth/v1/password/reset/email', body),

  verifyPasswordResetCode: (body: PasswordResetVerifyRequest) =>
    instance.post<ApiResponse<null>>('/auth/v1/password/reset/verify', body),

  resetPassword: (body: PasswordResetRequest) =>
    instance.patch<ApiResponse<null>>('/auth/v1/password/reset', body),

  getGoogleLoginUrl: async () => {
    const { data } = await instance.get<ApiResponse<GoogleAuthorizationUrlResult>>('/auth/v1/oauth/google/login');
    return data.result;
  },

  getGoogleSignupUrl: async (body: GoogleSignupRequest) => {
    const { data } = await instance.post<ApiResponse<GoogleAuthorizationUrlResult>>('/auth/v1/oauth/google/signup', body);
    return data.result;
  },

  exchangeGoogleTicket: async (body: GoogleExchangeRequest) => {
    const { data } = await instance.post<ApiResponse<GoogleLoginResult>>('/auth/v1/oauth/google/exchange', body);
    localStorage.setItem('accessToken', data.result.accessToken);
    localStorage.setItem('refreshToken', data.result.refreshToken);
    return data.result;
  },

  getGoogleLinkUrl: async () => {
    const { data } = await instance.get<ApiResponse<GoogleAuthorizationUrlResult>>('/api/v1/members/me/social-accounts/google/link');
    return data.result;
  },
};
