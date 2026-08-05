import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
const maxImageSize = 5 * 1024 * 1024;
import ModalOverlay from '../../../shared/components/ModalOverlay';
import CloseButton from '../../../shared/components/CloseButton';
import profileImage from '../../../assets/icons/profile-image.svg';
import addIcon from '../../../assets/icons/icon-profile-add.svg';
import kakaoIcon from '../../../assets/icons/icon-kakao.svg';
import googleIcon from '../../../assets/icons/icon-google.svg';
import chevronRightIcon from '../../../assets/icons/chevron-right.svg';

type ProfileEditModalProps = {
  name: string;
  email: string;
  avatarUrl?: string;
  googleLinked?: boolean;
  onClose: () => void;
  onSave: (data: { name: string; avatarFile: File | null }) => Promise<void>;
  onDeleteAvatar?: () => Promise<void>;
  onConnectKakao?: () => void;
  onConnectGoogle?: () => void;
  onUnlinkGoogle?: () => Promise<void>;
  isGoogleConnecting?: boolean;
};

export default function ProfileEditModal({
  name,
  email,
  avatarUrl,
  googleLinked = false,
  onClose,
  onSave,
  onDeleteAvatar,
  onConnectKakao,
  onConnectGoogle,
  onUnlinkGoogle,
  isGoogleConnecting = false,
}: ProfileEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameValue, setNameValue] = useState(name);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!(allowedImageTypes as readonly string[]).includes(file.type)) {
      setSaveError('jpg, png, webp 형식의 이미지만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > maxImageSize) {
      setSaveError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    setSaveError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarDelete = async () => {
    if (avatarFile !== null) {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(null);
      setAvatarPreview(avatarUrl);
      return;
    }
    try {
      await onDeleteAvatar?.();
      setAvatarPreview(undefined);
    } catch {
      setSaveError('프로필 이미지 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const hasAvatar = Boolean(avatarPreview);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSaveError('');

    const trimmedName = nameValue.trim();
    if (trimmedName.length === 0) {
      setSaveError('이름은 필수 입력값입니다.');
      return;
    }
    if (trimmedName.length > 20) {
      setSaveError('이름은 20자 이하로 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ name: trimmedName, avatarFile });
      onClose();
    } catch {
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <form
        className="flex w-[790px] flex-col items-center gap-[70px] rounded-5 bg-gray-20 px-11 py-[50px]"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex w-full flex-col gap-[50px]">
          <div className="flex w-full items-center justify-between">
            <span className="heading-05 text-gray-800">프로필 수정</span>
            <CloseButton
              onClick={onClose}
              hasBackground={false}
              iconSize="xs"
              className="w-9 h-9 rounded-full"
            />
          </div>

          <div className="flex h-[165px] w-full items-center gap-[30px] rounded-4 bg-white px-10 py-[30px]">
            <div className="relative shrink-0">
              <div
                className="size-[86px] rounded-full"
                style={{ boxShadow: '0px 3px 8px 0 rgba(6,49,88,0.08)' }}
              >
                <div className="relative size-full overflow-hidden rounded-full">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={nameValue}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={profileImage}
                      alt={nameValue}
                      className="absolute max-w-none"
                      style={{ left: '-8px', top: '-5px', width: '102px', height: '102px' }}
                    />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="프로필 이미지 변경"
                className="absolute bottom-0 right-0 flex size-6 items-center justify-center"
              >
                <img src={addIcon} alt="" className="size-6" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={allowedImageTypes.join(',')}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex flex-col items-start justify-center gap-5">
              <div className="flex flex-col items-start gap-1">
                <p className="title-01 text-gray-900">{nameValue} 님</p>
                <p className="body-03 text-gray-600">{email}</p>
              </div>
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="body-02 rounded-2 bg-primary-50 px-[18px] py-2 text-primary-500"
                >
                  프로필 변경
                </button>
                <button
                  type="button"
                  onClick={handleAvatarDelete}
                  disabled={!hasAvatar}
                  className={[
                    'body-02 rounded-2 px-[18px] py-2',
                    hasAvatar
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-400 cursor-default',
                  ].join(' ')}
                >
                  프로필 삭제
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 px-10">
            <div className="flex w-full flex-col gap-[10px]">
              <label htmlFor="profile-edit-name" className="text-[16px] text-gray-900">
                이름
              </label>
              <input
                id="profile-edit-name"
                type="text"
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                className="body-03 h-[45px] w-full rounded-2 border border-gray-100 bg-white px-4 py-3 text-gray-900 outline-none focus:border-primary-500"
              />
            </div>
            <div className="flex w-full flex-col gap-[10px]">
              <span className="text-[16px] text-gray-900">이메일</span>
              <div className="body-03 flex h-[45px] w-full items-center rounded-2 bg-gray-100 px-4 py-3 text-gray-600">
                {email}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 border-t border-gray-100 px-10 py-7">
            <div className="flex flex-col items-start gap-1">
              <p className="title-02 text-gray-900">연동 계정</p>
              <p className="body-03 text-gray-600">
                소셜 계정으로 더 빠르고 간편하게 로그인할 수 있어요.
              </p>
            </div>
            <div className="flex w-full flex-col items-start">
              <button
                type="button"
                onClick={onConnectKakao}
                className="flex h-[50px] w-full items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <img src={kakaoIcon} alt="" className="size-6" />
                  <span className="body-03 text-gray-900">카카오 계정 연결하기</span>
                </span>
                <img src={chevronRightIcon} alt="" className="h-3.5" />
              </button>
              {googleLinked ? (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await onUnlinkGoogle?.();
                    } catch {
                      setSaveError('Google 계정 연결 해제에 실패했습니다. 다시 시도해주세요.');
                    }
                  }}
                  className="flex h-[50px] w-full items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <img src={googleIcon} alt="" className="size-6" />
                    <span className="body-03 text-gray-900">Google 계정 연결 해제</span>
                  </span>
                  <img src={chevronRightIcon} alt="" className="h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onConnectGoogle}
                  disabled={isGoogleConnecting}
                  className="flex h-[50px] w-full items-center justify-between disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <img src={googleIcon} alt="" className="size-6" />
                    <span className="body-03 text-gray-900">Google 계정 연결하기</span>
                  </span>
                  <img src={chevronRightIcon} alt="" className="h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-[400px] flex-col gap-3">
          {saveError && (
            <span className="body-04 text-center text-[#FF2A14]">{saveError}</span>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="title-02 w-full rounded-2 bg-primary-500 py-[13px] text-center text-white disabled:opacity-50"
          >
            저장하기
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}
