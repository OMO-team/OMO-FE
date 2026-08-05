export type MemberProvider = 'LOCAL' | 'GOOGLE' | 'KAKAO';

export type MyInfoResult = {
  memberId: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
  profileImageUrlExpiresAt: string | null;
  provider: MemberProvider;
};

export type UpdateProfileRequest = {
  name: string;
};

export type UpdateProfileResult = {
  memberId: number;
  name: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type SettingsResult = {
  pushNotification: boolean;
  emailNotification: boolean;
  autoSave: boolean;
};

export type UpdateSettingsRequest = {
  pushNotification?: boolean;
  emailNotification?: boolean;
  autoSave?: boolean;
};

export type ProfileImageUploadUrlRequest = {
  fileName: string;
  contentType: string;
  fileSize: number;
};

export type ProfileImageUploadUrlResult = {
  uploadUrl: string;
  objectKey: string;
  contentType: string;
  expiresAt: string;
};

export type ProfileImageUpdateRequest = {
  objectKey: string;
};

export type ProfileImageUpdateResult = {
  memberId: number;
  objectKey: string;
};

export type SocialAccountStatus = {
  googleLinked: boolean;
};
