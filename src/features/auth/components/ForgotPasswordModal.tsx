import { useState, type ChangeEvent, type FormEvent } from 'react';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import CloseButton from '../../../shared/components/CloseButton';
import errorReverseIcon from '../../../assets/icons/error-reverse.svg';
import eyeIcon from '../../../assets/icons/icon-eye.svg';

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
      {/* 전체 모달: padding 40 44 50 44, bg #F8F9FA, border-radius 20px */}
      <form
        className="inline-flex flex-col items-center pt-10 px-11 pb-[50px] gap-1 rounded-[20px] bg-[#F8F9FA]"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Frame 11125: gap 36 */}
        <div className="flex flex-col justify-center items-center gap-9">

          {/* Frame 11119: width 400, gap 7 */}
          <div className="flex w-[400px] flex-col items-start gap-[7px]">
            {/* Frame 10796: title + X button, space-between */}
            <div className="flex justify-between items-center self-stretch">
              <span
                className="text-[#2B313B]"
                style={{
                  fontFamily: 'Pretendard Variable',
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: '140%',
                  letterSpacing: '-0.36px',
                }}
              >
                비밀번호 찾기
              </span>
              {/* X 버튼: 36×36, border-radius 100px */}
              <CloseButton
                onClick={onClose}
                hasBackground={false}
                iconSize="xs"
                className="w-9 h-9 rounded-full"
              />
            </div>
            {/* 부제목 */}
            <span
              className="text-[#566276]"
              style={{
                fontFamily: 'Pretendard Variable',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.28px',
              }}
            >
              안전한 계정 관리를 위해 비밀번호를 변경할 수 있어요.
            </span>
          </div>

          {/* Frame 11126: gap 60 */}
          <div className="flex flex-col items-start gap-[60px]">

            {/* Frame 11123: width 400, gap 40 */}
            <div className="flex w-[400px] flex-col items-start gap-10">

              {/* Frame 11115: gap 30 (이메일 + 비밀번호들) */}
              <div className="flex flex-col items-start gap-[30px]">

                {/* Frame 11113: 이메일 섹션 (justify-flex-end, align-items:flex-end, gap:8) */}
                <div className="flex justify-end items-end gap-2">
                  {/* Frame 11128: column, gap 8 */}
                  <div className="flex flex-col items-start gap-2">
                    {/* Frame 11129: column, gap 4 (라벨 텍스트들) */}
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className="text-[#181A1F]"
                        style={{
                          fontFamily: 'Pretendard Variable',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '140%',
                          letterSpacing: '-0.28px',
                        }}
                      >
                        이메일
                      </span>
                      <span
                        className="text-[#566276]"
                        style={{
                          fontFamily: 'Pretendard Variable',
                          fontSize: '12px',
                          fontWeight: 400,
                          lineHeight: '140%',
                          letterSpacing: '-0.24px',
                        }}
                      >
                        가입하신 이메일 주소를 입력해주세요.
                      </span>
                    </div>
                    {/* Frame 11130: 이메일 input + 인증 버튼, gap 8 */}
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        placeholder="이메일을 입력해주세요"
                        className={`w-[328px] h-[45px] px-4 py-3 rounded-lg outline-none
                          text-[#181A1F] placeholder:text-[#B8BFCB] bg-white
                          border transition-colors
                          ${emailError ? 'border-[#FF4633]' : 'border-[#E7EAEF] focus:border-[#1A91FF]'}`}
                        style={{
                          fontFamily: 'Pretendard Variable',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '150%',
                          letterSpacing: '-0.28px',
                        }}
                      />
                      <button
                        type="button"
                        className="h-11 px-[18px] py-2 rounded-lg bg-[#E5F3FF]"
                        style={{
                          color: '#0085FF',
                          fontFamily: 'Pretendard Variable',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '140%',
                          letterSpacing: '-0.28px',
                        }}
                      >
                        인증
                      </button>
                    </div>
                    {emailError && (
                      <div className="flex items-center gap-2 px-2">
                        <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0" />
                        <span
                          className="text-[#FF2A14]"
                          style={{
                            fontFamily: 'Pretendard Variable',
                            fontSize: '12px',
                            fontWeight: 400,
                            lineHeight: '140%',
                            letterSpacing: '-0.24px',
                          }}
                        >
                          {emailError}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Frame 11127: 비밀번호 섹션들, gap 16 */}
                <div className="flex flex-col items-start gap-4 self-stretch">

                  {/* 새 비밀번호 (Frame 11115 내부) */}
                  <div className="flex flex-col items-start gap-2 self-stretch">
                    <span
                      className="text-[#181A1F] self-stretch"
                      style={{
                        fontFamily: 'Pretendard Variable',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '140%',
                        letterSpacing: '-0.28px',
                      }}
                    >
                      새 비밀번호
                    </span>
                    <div
                      className={`flex items-center h-[45px] px-4 py-3 self-stretch rounded-lg bg-white border transition-colors gap-1
                        ${newPasswordError ? 'border-[#FF4633]' : 'border-[#E7EAEF] focus-within:border-[#1A91FF]'}`}
                    >
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                        placeholder="비밀번호를 입력해주세요"
                        className="flex-1 outline-none bg-transparent text-[#181A1F] placeholder:text-[#B8BFCB]"
                        style={{
                          fontFamily: 'Pretendard Variable',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '150%',
                          letterSpacing: '-0.28px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((p) => !p)}
                        className="shrink-0 w-5 h-5 flex items-center justify-center"
                      >
                        <img src={eyeIcon} alt="비밀번호 표시" className="w-5 h-5" />
                      </button>
                    </div>
                    {newPasswordError && (
                      <div className="flex items-center gap-1 px-2">
                        <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0" />
                        <span
                          className="text-[#FF2A14]"
                          style={{
                            fontFamily: 'Pretendard Variable',
                            fontSize: '12px',
                            fontWeight: 400,
                            lineHeight: '140%',
                            letterSpacing: '-0.24px',
                          }}
                        >
                          {newPasswordError}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 새 비밀번호 확인 (Frame 11114) */}
                  <div className="flex flex-col items-start gap-2 self-stretch">
                    <span
                      className="text-[#181A1F] self-stretch"
                      style={{
                        fontFamily: 'Pretendard Variable',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '140%',
                        letterSpacing: '-0.28px',
                      }}
                    >
                      새 비밀번호 확인
                    </span>
                    <div
                      className={`flex items-center h-[45px] px-4 py-3 self-stretch rounded-lg bg-white border transition-colors gap-1
                        ${confirmPasswordError ? 'border-[#FF4633]' : 'border-[#E7EAEF] focus-within:border-[#1A91FF]'}`}
                    >
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 다시 입력해주세요"
                        className="flex-1 outline-none bg-transparent text-[#181A1F] placeholder:text-[#B8BFCB]"
                        style={{
                          fontFamily: 'Pretendard Variable',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '150%',
                          letterSpacing: '-0.28px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="shrink-0 w-5 h-5 flex items-center justify-center"
                      >
                        <img src={eyeIcon} alt="비밀번호 표시" className="w-5 h-5" />
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <div className="flex items-center gap-1 px-2">
                        <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0" />
                        <span
                          className="text-[#FF2A14]"
                          style={{
                            fontFamily: 'Pretendard Variable',
                            fontSize: '12px',
                            fontWeight: 400,
                            lineHeight: '140%',
                            letterSpacing: '-0.24px',
                          }}
                        >
                          {confirmPasswordError}
                        </span>
                      </div>
                    )}
                    {/* Frame 11133: 힌트 텍스트, 항상 표시, gap 4 */}
                    <div className="flex items-center px-2 gap-1">
                      <span
                        className="text-[#566276]"
                        style={{
                          fontFamily: 'Pretendard Variable',
                          fontSize: '12px',
                          fontWeight: 400,
                          lineHeight: '140%',
                          letterSpacing: '-0.24px',
                        }}
                      >
                        영문, 숫자 특수문자를 포함해 8자 이상 입력해주세요.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Frame 11122: 소셜 안내 + 버튼, gap 16 */}
            <div className="flex w-[400px] flex-col items-start gap-4">
              {/* Frame 11124: 소셜 경고 (항상 표시) */}
              <div className="flex items-start gap-2 self-stretch">
                <img src={errorReverseIcon} alt="" className="w-4 h-4 shrink-0 mt-[1px]" />
                <span
                  className="text-[#FF2A14]"
                  style={{
                    fontFamily: 'Pretendard Variable',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '140%',
                    letterSpacing: '-0.24px',
                  }}
                >
                  소셜 계정으로 가입한 사용자는 비밀번호 변경이 제한될 수 있어요.
                </span>
              </div>

              {/* L_button: 비밀번호 재설정 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center items-center self-stretch rounded-lg bg-[#0085FF] disabled:opacity-50"
                style={{ padding: '13px 169px' }}
              >
                <span
                  className="text-white"
                  style={{
                    fontFamily: 'Pretendard Variable',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '140%',
                    letterSpacing: '-0.32px',
                  }}
                >
                  비밀번호 재설정
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </ModalOverlay>
  );
}
