import { useState, type ChangeEvent, type FormEvent } from 'react';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import CloseButton from '../../../shared/components/CloseButton';
import EyeIcon from '../../../shared/components/EyeIcon';
import errorReverseIcon from '../../../assets/icons/error-reverse.svg';

type ForgotPasswordModalProps = {
  onClose: () => void;
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setEmailError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!email) {
      setEmailError('가입하신 이메일 주소를 입력해주세요.');
      hasError = true;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      setNewPasswordError('영문, 숫자 특수문자를 포함해 8자 이상 입력해주세요.');
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      // TODO: API 연결
      onClose();
    } catch {
      setEmailError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
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

          <div className="flex flex-col items-start gap-[60px]">

            <div className="flex w-[400px] flex-col items-start gap-10">

              <div className="flex flex-col items-start gap-[30px]">

                {/* 이메일 섹션 */}
                <div className="flex justify-end items-end gap-2">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-col items-start gap-1">
                      <span className="body-02 text-gray-900">이메일</span>
                      <span className="label-01 text-gray-600">
                        가입하신 이메일 주소를 입력해주세요.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        placeholder="이메일을 입력해주세요"
                        className={`w-[328px] h-[45px] px-4 py-3 rounded-lg outline-none body-03
                          text-gray-900 placeholder:text-gray-300 bg-white
                          border transition-colors
                          ${emailError ? 'border-warning-400' : 'border-gray-100 focus:border-primary-400'}`}
                      />
                      <button
                        type="button"
                        className="h-11 px-[18px] py-2 rounded-lg bg-primary-50 body-02 text-primary-500"
                      >
                        인증
                      </button>
                    </div>
                    {emailError && (
                      <div className="flex items-center gap-2 px-2">
                        <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0" />
                        <span className="label-01 text-[#FF2A14]">{emailError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 비밀번호 섹션들 */}
                <div className="flex flex-col items-start gap-4 self-stretch">

                  {/* 새 비밀번호 */}
                  <div className="flex flex-col items-start gap-2 self-stretch">
                    <span className="body-02 text-gray-900 self-stretch">새 비밀번호</span>
                    <div
                      className={`flex items-center h-[45px] px-4 py-3 self-stretch rounded-lg bg-white border transition-colors gap-1
                        ${newPasswordError ? 'border-warning-400' : 'border-gray-100 focus-within:border-primary-400'}`}
                    >
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                        placeholder="비밀번호를 입력해주세요"
                        className="flex-1 outline-none bg-transparent body-03 text-gray-900 placeholder:text-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((p) => !p)}
                        className="shrink-0 w-5 h-5 flex items-center justify-center"
                      >
                        <EyeIcon color={newPasswordError ? '#FF2A14' : showNewPassword ? 'var(--color-primary-500)' : 'var(--color-gray-300)'} />
                      </button>
                    </div>
                    {newPasswordError && (
                      <div className="flex items-center gap-1 px-2">
                        <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0" />
                        <span className="label-01 text-[#FF2A14]">{newPasswordError}</span>
                      </div>
                    )}
                  </div>

                  {/* 새 비밀번호 확인 */}
                  <div className="flex flex-col items-start gap-2 self-stretch">
                    <span className="body-02 text-gray-900 self-stretch">새 비밀번호 확인</span>
                    <div
                      className={`flex items-center h-[45px] px-4 py-3 self-stretch rounded-lg bg-white border transition-colors gap-1
                        ${confirmPasswordError ? 'border-warning-400' : 'border-gray-100 focus-within:border-primary-400'}`}
                    >
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 다시 입력해주세요"
                        className="flex-1 outline-none bg-transparent body-03 text-gray-900 placeholder:text-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="shrink-0 w-5 h-5 flex items-center justify-center"
                      >
                        <EyeIcon color={confirmPasswordError ? '#FF2A14' : showConfirmPassword ? 'var(--color-primary-500)' : 'var(--color-gray-300)'} />
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <div className="flex items-center gap-1 px-2">
                        <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0" />
                        <span className="label-01 text-[#FF2A14]">{confirmPasswordError}</span>
                      </div>
                    )}
                    <div className="flex items-center px-2 gap-1">
                      <span className="label-01 text-gray-600">
                        영문, 숫자 특수문자를 포함해 8자 이상 입력해주세요.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 소셜 안내 + 버튼 */}
            <div className="flex w-[400px] flex-col items-start gap-4">
              <div className="flex items-start gap-2 self-stretch">
                <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0 mt-[1px]" />
                <span className="label-01 text-[#FF2A14]">
                  소셜 계정으로 가입한 사용자는 비밀번호 변경이 제한될 수 있어요.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center items-center self-stretch rounded-lg bg-primary-500 disabled:opacity-50"
                style={{ padding: '13px 169px' }}
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
