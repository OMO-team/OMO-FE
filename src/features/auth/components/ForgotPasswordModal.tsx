import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EMAIL_REGEX } from '../constants/emailRegex';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import CloseButton from '../../../shared/components/CloseButton';
import Input from '../../../shared/components/Input';
import VerifyButton from '../../../shared/components/VerifyButton';
import errorReverseIcon from '../../../assets/icons/error-reverse.svg';
import { authApi } from '../api/authApi';
import { passwordRegex } from '../../../shared/constants/passwordRegex';
import { useAuthStore } from '../store/useAuthStore';

type ForgotPasswordModalProps = {
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ForgotPasswordModal({ onClose, onSuccess }: ForgotPasswordModalProps) {
  const navigate = useNavigate();
  const resetPasswordDraft = useAuthStore((s) => s.resetPasswordDraft);
  const setResetPasswordDraft = useAuthStore((s) => s.setResetPasswordDraft);
  const clearResetPasswordDraft = useAuthStore((s) => s.clearResetPasswordDraft);

  const [email, setEmail] = useState(resetPasswordDraft?.email ?? '');
  const [emailError, setEmailError] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(resetPasswordDraft?.isEmailVerified ?? false);

  const [newPassword, setNewPassword] = useState(resetPasswordDraft?.newPassword ?? '');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(resetPasswordDraft?.confirmPassword ?? '');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 이메일 인증을 위해 잠시 인증 페이지로 이동할 때만 draft를 유지 — 그 외(X 닫기, 바깥 클릭 등
   *  실제 닫기)에는 언마운트 시 draft를 비운다. SignupModal과 동일한 패턴 */
  const keepDraftOnUnmountRef = useRef(false);

  useEffect(() => {
    return () => {
      if (!keepDraftOnUnmountRef.current) {
        clearResetPasswordDraft();
      }
    };
  }, [clearResetPasswordDraft]);

  const handleSendPasswordResetEmail = async () => {
    if (!email) { setEmailError('가입하신 이메일 주소를 입력해주세요.'); return; }
    if (!EMAIL_REGEX.test(email)) { setEmailError('올바른 이메일 형식을 입력해주세요.'); return; }
    if (isSendingCode) return;
    setEmailError('');
    setIsSendingCode(true);
    try {
      await authApi.sendPasswordResetEmail({ email });
      setResetPasswordDraft({ email, newPassword, confirmPassword, isEmailVerified: false });
      keepDraftOnUnmountRef.current = true;
      onClose();
      navigate('/auth/password-reset/verify', { state: { email } });
    } catch (error) {
      if (axios.isAxiosError<{ code?: string }>(error) && error.response?.data?.code === 'MEMBER404_1') {
        setEmailError('가입되지 않은 이메일입니다.');
      } else {
        setEmailError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setEmailError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!isEmailVerified) {
      setEmailError('이메일 인증을 먼저 완료해주세요.');
      hasError = true;
    }
    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError('영문, 숫자, 특수문자 중 2가지 이상 조합으로 8~20자 입력해주세요.');
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ email, newPassword, newPasswordConfirm: confirmPassword });
      clearResetPasswordDraft();
      onClose();
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError<{ code?: string }>(error)) {
        const errorCode = error.response?.data?.code;
        if (errorCode === 'MEMBER404_1') {
          setEmailError('가입되지 않은 이메일입니다.');
        } else if (errorCode === 'AUTH400_3') {
          setIsEmailVerified(false);
          setEmailError('이메일 인증을 다시 완료해주세요.');
        } else {
          setNewPasswordError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        setNewPasswordError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <form
        className="inline-flex flex-col items-center pt-10 px-11 pb-[50px] gap-1 rounded-5 bg-gray-20"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-center items-center gap-9">

          <div className="flex w-[400px] flex-col items-start gap-[7px]">
            <div className="flex justify-between items-center self-stretch">
              <span className="heading-06 text-gray-800">비밀번호 찾기</span>
              <CloseButton
                onClick={onClose}
                hasBackground={false}
                iconSize="xs"
                className="w-9 h-9 rounded-full"
              />
            </div>
            <span className="body-03 text-gray-600">
              안전한 계정 관리를 위해 비밀번호를 변경할 수 있어요.
            </span>
          </div>

          <div className="flex flex-col items-start gap-[60px] self-stretch">

            <div className="flex w-[400px] flex-col items-start gap-10">

              <div className="flex flex-col items-start gap-[30px] self-stretch">

                {/* 이메일 섹션 — 인증번호는 별도 페이지(회원가입과 동일한 인증 흐름)에서 입력받는다 */}
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <div className="flex flex-col items-start gap-1">
                    <label htmlFor="forgot-email" className="body-02 text-gray-900">이메일</label>
                    <span className="label-01 text-gray-600">가입하신 이메일 주소를 입력해주세요.</span>
                  </div>
                  <div className="flex items-start gap-2 self-stretch">
                    <div className="flex-1">
                      <Input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setEmail(e.target.value);
                          if (isEmailVerified) setIsEmailVerified(false);
                        }}
                        placeholder="이메일을 입력해주세요"
                        error={emailError}
                      />
                    </div>
                    <VerifyButton
                      active={email.length > 0 && !isSendingCode && !isEmailVerified}
                      onClick={handleSendPasswordResetEmail}
                      label={isEmailVerified ? '인증완료' : isSendingCode ? '발송 중...' : '인증'}
                    />
                  </div>
                  {isEmailVerified && (
                    <span className="body-04 text-primary-500">이메일 인증이 완료되었습니다.</span>
                  )}
                </div>

                {/* 비밀번호 섹션들 */}
                <div className="flex flex-col items-start gap-4 self-stretch">
                  <Input
                    label="새 비밀번호"
                    type="password"
                    value={newPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    error={newPasswordError}
                  />
                  <div className="flex flex-col gap-2 self-stretch">
                    <Input
                      label="새 비밀번호 확인"
                      type="password"
                      value={confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호를 다시 입력해주세요"
                      error={confirmPasswordError}
                    />
                    {!newPasswordError && (
                      <span className="label-01 px-2 text-gray-600">영문, 숫자, 특수문자 중 2가지 이상 조합으로 8~20자 입력해주세요.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 소셜 안내 + 버튼 */}
            <div className="flex w-[400px] flex-col items-start gap-4">
              <div className="flex items-start gap-2 self-stretch">
                <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0 mt-[1px]" />
                <span className="label-01 text-red-500">
                  소셜 계정으로 가입한 사용자는 비밀번호 변경이 제한될 수 있어요.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center items-center self-stretch rounded-lg bg-primary-500 py-[13px] whitespace-nowrap disabled:opacity-50"
              >
                <span className="title-04 text-white">비밀번호 재설정</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </ModalOverlay>
  );
}
