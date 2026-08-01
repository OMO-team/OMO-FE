import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type {
  MyInfoResult,
  UpdateProfileRequest,
  UpdateProfileResult,
  ChangePasswordRequest,
  SettingsResult,
  UpdateSettingsRequest,
  ProfileImageUploadUrlRequest,
  ProfileImageUploadUrlResult,
  ProfileImageUpdateRequest,
  ProfileImageUpdateResult,
  SocialAccountStatus,
} from '../types/dto';

export const memberApi = {
  getMyInfo: async () => {
    const { data } = await instance.get<ApiResponse<MyInfoResult>>('/api/v1/members/me');
    return data.result;
  },

  updateProfile: async (body: UpdateProfileRequest) => {
    const { data } = await instance.patch<ApiResponse<UpdateProfileResult>>(
      '/api/v1/members/me/profile',
      body,
    );
    return data.result;
  },

  changePassword: (body: ChangePasswordRequest) =>
    instance.patch<ApiResponse<null>>('/api/v1/members/me/password', body),

  getSettings: async () => {
    const { data } = await instance.get<ApiResponse<SettingsResult>>('/api/v1/members/me/settings');
    return data.result;
  },

  updateSettings: async (body: UpdateSettingsRequest) => {
    const { data } = await instance.patch<ApiResponse<SettingsResult>>(
      '/api/v1/members/me/settings',
      body,
    );
    return data.result;
  },

  getProfileImageUploadUrl: async (body: ProfileImageUploadUrlRequest) => {
    const { data } = await instance.post<ApiResponse<ProfileImageUploadUrlResult>>(
      '/api/v1/members/me/profile-image/upload-url',
      body,
    );
    return data.result;
  },

  uploadProfileImageToS3: (uploadUrl: string, file: File, contentType: string) =>
    fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
      signal: AbortSignal.timeout(30_000),
    }),

  updateProfileImage: async (body: ProfileImageUpdateRequest) => {
    const { data } = await instance.patch<ApiResponse<ProfileImageUpdateResult>>(
      '/api/v1/members/me/profile-image',
      body,
    );
    return data.result;
  },

  deleteProfileImage: () =>
    instance.delete<ApiResponse<null>>('/api/v1/members/me/profile-image'),

  withdraw: () =>
    instance.delete<ApiResponse<null>>('/api/v1/members/me'),

  getSocialAccountStatus: async () => {
    const { data } = await instance.get<ApiResponse<SocialAccountStatus>>(
      '/api/v1/members/me/social-accounts',
    );
    return data.result;
  },

  unlinkGoogle: () =>
    instance.delete<ApiResponse<null>>('/api/v1/members/me/social-accounts/google'),
};
