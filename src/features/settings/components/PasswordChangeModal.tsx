import { useState, type FormEvent } from 'react';
import axios from 'axios';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import CloseButton from '../../../shared/components/CloseButton';
import Input from '../../../shared/components/Input';
import errorReverseIcon from '../../../assets/icons/error-reverse.svg';
import { memberApi } from '../api/memberApi';
import { passwordRegex } from '../../../shared/constants/passwordRegex';

type PasswordChangeModalProps = {
  onClose: () => void;
  onForgotPassword: () => void;
  onSuccess?: () => void;
};

export default function PasswordChangeModal({ onClose, onForgotPassword, onSuccess }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError('현재 비밀번호를 입력해주세요.');
      hasError = true;
    }
    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError('영문, 숫자, 특수문자 중 2가지 이상 조합으로 8~20자 입력해주세요.');
      hasError = true;
    }
    if (confirmPassword.length < 8) {
      setConfirmPasswordError('8글자 이상 입력해 주세요');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      await memberApi.changePassword({ currentPassword, newPassword, newPasswordConfirm: confirmPassword });
      onSuccess?.();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setCurrentPasswordError('현재 비밀번호가 일치하지 않습니다.');
      } else {
        setCurrentPasswordError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <form
        className="inline-flex flex-col items-center gap-9 rounded-5 bg-gray-20 px-11 pb-[50px] pt-10"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-[400px] flex-col items-start gap-[7px]">
          <div className="flex items-center justify-between self-stretch">
            <span className="heading-05 text-gray-800">비밀번호 변경</span>
            <CloseButton onClick={onClose} hasBackground={false} iconSize="xs" className="h-9 w-9 rounded-full" />
          </div>
          <span className="body-03 text-gray-600">
            안전한 계정 관리를 위해 비밀번호를 변경할 수 있어요.
          </span>
        </div>

        <div className="flex flex-col items-start gap-[60px]">
          <div className="flex w-[400px] flex-col items-start gap-10">
            <div className="flex w-full flex-col items-start gap-[30px]">
              <Input
                label="현재 비밀번호"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                error={currentPasswordError}
              />

              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full flex-col gap-2">
                  <Input
                    label="새 비밀번호"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    error={newPasswordError}
                  />
                  <span className="label-01 px-2 text-gray-600">
                    영문, 숫자, 특수문자 중 2가지 이상 조합으로 8~20자 입력해주세요.
                  </span>
                </div>
                <Input
                  label="새 비밀번호 확인"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  error={confirmPasswordError}
                />
              </div>
            </div>

            <div className="flex w-full items-center justify-between">
              <span className="label-01 text-gray-600">비밀번호를 잊으셨나요?</span>
              <button type="button" onClick={onForgotPassword} className="label-01 text-primary-500">
                비밀번호 찾기
              </button>
            </div>
          </div>

          <div className="flex w-[400px] flex-col items-start gap-4">
            <div className="flex items-start gap-2 self-stretch">
              <img src={errorReverseIcon} alt="" className="mt-[1px] h-4 w-4 shrink-0" />
              <span className="label-01 text-[#FF2A14]">
                소셜 계정으로 가입한 사용자는 비밀번호 변경이 제한될 수 있어요.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center self-stretch rounded-2 bg-primary-500 py-[13px] disabled:opacity-50"
            >
              <span className="title-04 text-white">비밀번호 변경하기</span>
            </button>
          </div>
        </div>
      </form>
    </ModalOverlay>
  );
}
