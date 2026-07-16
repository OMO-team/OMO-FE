import { useState, type ChangeEvent, type FormEvent } from 'react';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import CloseButton from '../../../shared/components/CloseButton';
import errorIcon from '../../../assets/icons/error.svg';
import eyeIcon from '../../../assets/icons/icon-eye.svg';

type ForgotPasswordModalProps = {
  onClose: () => void;
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const LABEL_STYLE = 'body-03 text-gray-700 font-medium';
const INPUT_BASE = 'w-full px-4 py-3 rounded-lg border body-03 text-gray-900 placeholder:text-gray-400 outline-none transition-colors';

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
  const [isDone, setIsDone] = useState(false);

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
      setNewPasswordError('영문, 숫자 특수문자를 포함해 8자 이상 입력해 주세요.');
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
      setIsDone(true);
    } catch {
      setEmailError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <ModalOverlay onClose={onClose}>
        <div
          className="flex flex-col items-center bg-white rounded-2xl shadow-xl w-[480px] px-8 py-8 gap-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex w-full justify-end">
            <CloseButton onClick={onClose} hasBackground={false} iconSize="xs" />
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="heading-04 text-gray-900">비밀번호 변경이 완료됐어요.</h2>
            <p className="body-03 text-gray-500">
              새 비밀번호로 안전하게 변경됐습니다.
              <br />
              새 비밀번호로 로그인해 주세요.
            </p>
          </div>
          <div className="flex flex-col w-full gap-2 body-04 text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
            <p>로그인 상태를 선택해 주세요.</p>
            <p>보안을 위해 다른 기기에서 이용 중이라면 이전 세션을 종료하고 새 비밀번호로 이용하실 수 있습니다.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-primary-500 text-white heading-06 hover:bg-blue-600 transition-colors"
          >
            로그인 하러 가기
          </button>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClose={onClose}>
      <form
        className="flex flex-col bg-white rounded-2xl shadow-xl w-[480px] px-8 py-8 gap-6"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="heading-04 text-gray-900">비밀번호 찾기</h2>
          <CloseButton onClick={onClose} hasBackground={false} iconSize="xs" />
        </div>

        <p className="body-03 text-gray-500">
          안전한 계정 관리를 위해 비밀번호를 변경할 수 있어요.
        </p>

        {/* 이메일 */}
        <div className="flex flex-col gap-1.5">
          <label className={LABEL_STYLE}>이메일</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="가입하신 이메일 주소를 입력해주세요."
              className={`flex-1 ${INPUT_BASE} ${emailError ? 'border-red-500' : 'border-gray-200 focus:border-[#1A91FF]'}`}
            />
            <button
              type="button"
              className="shrink-0 px-4 py-3 rounded-lg border border-gray-200 body-03 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              인증
            </button>
          </div>
          {emailError && (
            <div className="flex items-center gap-1">
              <img src={errorIcon} alt="" className="w-4 h-4 shrink-0" />
              <span className="body-04 text-red-500">{emailError}</span>
            </div>
          )}
        </div>

        {/* 새 비밀번호 */}
        <div className="flex flex-col gap-1.5">
          <label className={LABEL_STYLE}>새 비밀번호</label>
          <div className={`flex items-center ${INPUT_BASE} ${newPasswordError ? 'border-red-500' : 'border-gray-200 focus-within:border-[#1A91FF]'}`}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className="flex-1 outline-none bg-transparent body-03 text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((p) => !p)}
              className="shrink-0 flex items-center justify-center w-5 h-5"
            >
              <img src={eyeIcon} alt="비밀번호 표시" className="w-5 h-5" />
            </button>
          </div>
          {newPasswordError && (
            <div className="flex items-center gap-1">
              <img src={errorIcon} alt="" className="w-4 h-4 shrink-0" />
              <span className="body-04 text-red-500">{newPasswordError}</span>
            </div>
          )}
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="flex flex-col gap-1.5">
          <label className={LABEL_STYLE}>새 비밀번호 확인</label>
          <div className={`flex items-center ${INPUT_BASE} ${confirmPasswordError ? 'border-red-500' : 'border-gray-200 focus-within:border-[#1A91FF]'}`}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요"
              className="flex-1 outline-none bg-transparent body-03 text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="shrink-0 flex items-center justify-center w-5 h-5"
            >
              <img src={eyeIcon} alt="비밀번호 표시" className="w-5 h-5" />
            </button>
          </div>
          {confirmPasswordError && (
            <div className="flex items-center gap-1">
              <img src={errorIcon} alt="" className="w-4 h-4 shrink-0" />
              <span className="body-04 text-red-500">{confirmPasswordError}</span>
            </div>
          )}
          <p className="body-04 text-gray-400">소셜 계정으로 가입한 사용자는 비밀번호 변경이 제한될 수 있어요.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg bg-primary-500 text-white heading-06 disabled:opacity-50 hover:bg-blue-600 transition-colors"
        >
          비밀번호 재설정
        </button>
      </form>
    </ModalOverlay>
  );
}
