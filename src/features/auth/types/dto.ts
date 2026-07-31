// 회원가입
export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreedTermsIds: number[];
};

// 로그인
export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
};

// 이메일 인증
export type EmailSendRequest = {
  email: string;
};

export type EmailVerifyRequest = {
  email: string;
  code: string;
};

// 비밀번호 재설정
export type PasswordResetEmailRequest = {
  email: string;
};

export type PasswordResetVerifyRequest = {
  email: string;
  code: string;
};

export type PasswordResetRequest = {
  email: string;
  newPassword: string;
  newPasswordConfirm: string;
};

// 토큰 재발급
export type ReissueRequest = {
  refreshToken: string;
};

export type ReissueResult = {
  accessToken: string;
};
