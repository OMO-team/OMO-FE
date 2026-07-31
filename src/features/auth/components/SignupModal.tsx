import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import closeIcon from '../../../assets/icons/icon-close[14].svg';
import checkboxCheckedIcon from '../../../assets/icons/icon-checkbox-checked.svg';
import kakaoIcon from '../../../assets/icons/icon-kakao.svg';
import googleIcon from '../../../assets/icons/icon-google.svg';
import Input from '../../../shared/components/Input';
import VerifyButton from '../../../shared/components/VerifyButton';
import { authApi } from '../api/authApi';
import { passwordRegex } from '../constants/passwordRegex';
import { useAuthStore } from '../store/useAuthStore';

type SignupModalProps = {
  onClose: () => void;
  onLoginClick?: () => void;
};

function CheckIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.7839 0.219883C13.9223 0.360717 14 0.551702 14 0.750841C14 0.949979 13.9223 1.14097 13.7839 1.2818L5.48717 9.7253C5.41178 9.80205 5.32227 9.86294 5.22375 9.90448C5.12523 9.94602 5.01964 9.9674 4.913 9.9674C4.80636 9.9674 4.70076 9.94602 4.60224 9.90448C4.50372 9.86294 4.41421 9.80205 4.33882 9.7253L0.216279 5.53021C0.14771 5.46044 0.0933185 5.3776 0.0562092 5.28643C0.0190999 5.19527 7.22492e-10 5.09756 0 4.99888C-7.22492e-10 4.9002 0.0190999 4.80249 0.0562092 4.71132C0.0933185 4.62016 0.14771 4.53732 0.216279 4.46755C0.284848 4.39777 0.366252 4.34242 0.455841 4.30466C0.545431 4.2669 0.641453 4.24746 0.738424 4.24746C0.835395 4.24746 0.931417 4.2669 1.02101 4.30466C1.1106 4.34242 1.192 4.39777 1.26057 4.46755L4.91374 8.185L12.7396 0.219883C12.878 0.0790921 13.0657 0 13.2614 0C13.4571 0 13.6455 0.0790921 13.7839 0.219883Z"
        fill={color}
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
      <path d="M0.699951 0.699951L6.69995 6.69995L0.699951 12.7" stroke="var(--color-gray-400)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SignupModal({ onClose, onLoginClick }: SignupModalProps) {
  const navigate = useNavigate();
  const signupDraft = useAuthStore((s) => s.signupDraft);
  const setSignupDraft = useAuthStore((s) => s.setSignupDraft);
  const clearSignupDraft = useAuthStore((s) => s.clearSignupDraft);

  const [name, setName] = useState(signupDraft?.name ?? '');
  const [email, setEmail] = useState(signupDraft?.email ?? '');
  const [password, setPassword] = useState(signupDraft?.password ?? '');
  const [confirmPassword, setConfirmPassword] = useState(signupDraft?.confirmPassword ?? '');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(signupDraft?.isEmailVerified ?? false);
  const [isKakaoHovered, setIsKakaoHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [agreeAll, setAgreeAll] = useState((signupDraft?.agreeTerms && signupDraft?.agreePrivacy) ?? false);
  const [agreeTerms, setAgreeTerms] = useState(signupDraft?.agreeTerms ?? false);
  const [agreePrivacy, setAgreePrivacy] = useState(signupDraft?.agreePrivacy ?? false);

  const handleAgreeAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreeTerms(next);
    setAgreePrivacy(next);
  };

  const handleAgreeTerms = () => {
    const next = !agreeTerms;
    setAgreeTerms(next);
    if (!next) setAgreeAll(false);
    else if (agreePrivacy) setAgreeAll(true);
  };

  const handleAgreePrivacy = () => {
    const next = !agreePrivacy;
    setAgreePrivacy(next);
    if (!next) setAgreeAll(false);
    else if (agreeTerms) setAgreeAll(true);
  };

  const handleSendEmailCode = async () => {
    if (!email) { setEmailError('이메일을 입력해주세요.'); return; }
    if (isSendingCode) return;
    setEmailError('');
    setIsSendingCode(true);
    try {
      await authApi.sendEmailCode({ email });
      setSignupDraft({
        name,
        email,
        password,
        confirmPassword,
        agreeTerms,
        agreePrivacy,
        isEmailVerified: false,
      });
      onClose();
      navigate('/auth/email-verify', { state: { email } });
    } catch {
      setEmailError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;
    if (!name) { setNameError('이름을 입력해주세요.'); hasError = true; }
    if (!email) { setEmailError('이메일을 입력해주세요.'); hasError = true; }
    if (!passwordRegex.test(password)) { setPasswordError('영문, 숫자, 특수문자 중 2가지 이상 조합으로 8~20자 입력해주세요.'); hasError = true; }
    if (password !== confirmPassword) { setConfirmPasswordError('비밀번호가 일치하지 않습니다.'); hasError = true; }
    if (!isEmailVerified) { setEmailError('이메일 인증을 완료해주세요.'); hasError = true; }
    if (!agreeTerms || !agreePrivacy) { setEmailError('이용약관 및 개인정보 처리방침에 동의해주세요.'); hasError = true; }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      // 약관 ID: 1 = 이용약관, 2 = 개인정보처리방침 (GET /api/v1/terms 기준, 백엔드 확정값)
      const agreedTermsIds = [
        ...(agreeTerms ? [1] : []),
        ...(agreePrivacy ? [2] : []),
      ];
      await authApi.signup({ name, email, password, passwordConfirm: confirmPassword, agreedTermsIds });
      clearSignupDraft();
      onClose();
    } catch (error) {
      if (axios.isAxiosError<{ message: string }>(error) && error.response?.status === 409) {
        setEmailError('이미 사용 중인 이메일입니다.');
      } else {
        setEmailError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="inline-flex justify-center items-start rounded-4 bg-white"
      style={{ padding: '30px 40px 40px 40px', gap: '4px' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col items-center" style={{ gap: '36px' }}>

        {/* 헤더: 타이틀 + 닫기 */}
        <div className="flex items-center" style={{ width: '400px', gap: '118px' }}>
          <span className="title-01 text-gray-900" style={{ width: '257px' }}>
            회원가입
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex justify-center items-center flex-shrink-0"
            style={{ width: '24px', height: '24px' }}
          >
            <img src={closeIcon} alt="닫기" style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        <div className="flex flex-col items-center" style={{ gap: '24px', alignSelf: 'stretch' }}>
          <div className="flex flex-col items-center" style={{ gap: '40px', alignSelf: 'stretch' }}>

            {/* 회원가입 폼 */}
            <div className="flex flex-col items-start" style={{ gap: '16px', alignSelf: 'stretch' }}>

              {/* 이름 */}
              <Input
                label="이름"
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                error={nameError}
              />

              {/* 이메일 + 인증 버튼 */}
              <div className="flex flex-col gap-[6px] self-stretch">
                <span className="body-02 text-gray-900 self-stretch">이메일</span>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
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
                    onClick={handleSendEmailCode}
                    label={isEmailVerified ? '인증완료' : isSendingCode ? '발송 중...' : '인증'}
                  />
                </div>
                {isEmailVerified && (
                  <span className="body-04 text-primary-500">이메일 인증이 완료되었습니다.</span>
                )}
              </div>

              {/* 비밀번호 */}
              <Input
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                error={passwordError}
              />

              {/* 비밀번호 확인 */}
              <div className="flex flex-col gap-[8px] self-stretch">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  error={confirmPasswordError}
                />
                <span className="body-04 px-2 text-gray-400">8자 이상 20자 이하로 입력해 주세요.</span>
              </div>
            </div>

            {/* 동의 + 회원가입 버튼 */}
            <div className="flex flex-col items-start" style={{ gap: '24px', alignSelf: 'stretch' }}>

              <div className="flex flex-col items-start" style={{ width: '380px', gap: '8px' }}>

                {/* 전체 동의하기 */}
                <div className="flex items-center" style={{ gap: '4px', alignSelf: 'stretch' }}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={agreeAll}
                    aria-label="전체 동의하기"
                    onClick={handleAgreeAll}
                    className="flex justify-center items-center flex-shrink-0"
                    style={{ width: '24px', height: '24px' }}
                  >
                    {agreeAll ? (
                      <img src={checkboxCheckedIcon} alt="체크됨" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    ) : (
                      <div className="border border-gray-300 bg-white rounded-1" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    )}
                  </button>
                  <span className="body-02 text-gray-900">전체 동의하기</span>
                </div>

                <div className="flex flex-col items-start" style={{ gap: '8px', alignSelf: 'stretch' }}>

                  {/* 이용약관 동의 */}
                  <div className="flex items-center" style={{ paddingTop: '6px', alignSelf: 'stretch' }}>
                    <div className="flex items-center" style={{ width: '360px', gap: '8px' }}>
                      <button type="button" onClick={handleAgreeTerms} className="flex justify-center items-center flex-shrink-0" style={{ width: '20px', height: '20px' }}>
                        <CheckIcon color={agreeTerms ? 'var(--color-primary-500)' : 'var(--color-gray-300)'} />
                      </button>
                      <div className="flex items-center flex-1" style={{ gap: '4px' }}>
                        <span className="body-04 text-gray-800">이용약관 동의</span>
                        <span className="body-04 text-primary-500">(필수)</span>
                      </div>
                      <button type="button" className="flex justify-center items-center flex-shrink-0" style={{ width: '20px', height: '20px' }}>
                        <ArrowIcon />
                      </button>
                    </div>
                  </div>

                  {/* 개인정보 처리방침 동의 */}
                  <div className="flex items-center" style={{ paddingTop: '6px', alignSelf: 'stretch' }}>
                    <div className="flex items-center" style={{ width: '360px', gap: '8px' }}>
                      <button type="button" onClick={handleAgreePrivacy} className="flex justify-center items-center flex-shrink-0" style={{ width: '20px', height: '20px' }}>
                        <CheckIcon color={agreePrivacy ? 'var(--color-primary-500)' : 'var(--color-gray-300)'} />
                      </button>
                      <div className="flex items-center flex-1" style={{ gap: '4px' }}>
                        <span className="body-04 text-black">개인정보 처리방침 동의</span>
                        <span className="body-04 text-primary-500">(필수)</span>
                      </div>
                      <button type="button" className="flex justify-center items-center flex-shrink-0" style={{ width: '20px', height: '20px' }}>
                        <ArrowIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center items-center rounded-2 bg-primary-500 title-02 text-white disabled:opacity-50"
                style={{ padding: '13px 169px', alignSelf: 'stretch' }}
              >
                {isSubmitting ? '처리 중...' : '회원가입'}
              </button>
            </div>
          </div>

          {/* 또는 + 소셜 로그인 + 로그인 유도 */}
          <div className="flex flex-col items-center self-stretch" style={{ gap: '24px' }}>

            {/* 또는 구분선 */}
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="bg-gray-400" style={{ width: '166px', height: '0.6px' }} />
              <span className="body-04 text-gray-400">또는</span>
              <div className="bg-gray-400" style={{ width: '166px', height: '0.6px' }} />
            </div>

            <div className="flex flex-col items-center" style={{ gap: '24px' }}>

              {/* 소셜 로그인 버튼들 */}
              <div className="flex flex-col items-start" style={{ gap: '12px' }}>
                <button
                  type="button"
                  className="flex flex-col justify-center items-center rounded-2"
                  onMouseEnter={() => setIsKakaoHovered(true)}
                  onMouseLeave={() => setIsKakaoHovered(false)}
                  style={{ width: '400px', height: '48px', padding: '8px 12px 8px 10px', background: isKakaoHovered ? '#F5D401' : '#FAE100', gap: '4px', transition: 'background 0.15s' }}
                >
                  <div className="flex justify-center items-center" style={{ width: '350px', gap: '104px' }}>
                    <div className="flex justify-center items-center flex-shrink-0" style={{ width: '24px', height: '24px', padding: '3px 2px' }}>
                      <img src={kakaoIcon} alt="카카오" style={{ width: '20px', height: '18px', flexShrink: 0 }} />
                    </div>
                    <span className="title-02 text-gray-900 text-center" style={{ width: '96px' }}>카카오 로그인</span>
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  </div>
                </button>

                <button
                  type="button"
                  className="flex flex-col justify-center items-center rounded-2"
                  onMouseEnter={() => setIsGoogleHovered(true)}
                  onMouseLeave={() => setIsGoogleHovered(false)}
                  style={{ width: '400px', height: '48px', padding: '8px 12px 8px 10px', background: isGoogleHovered ? '#E7E6E6' : '#F2F2F2', gap: '4px', transition: 'background 0.15s' }}
                >
                  <div className="flex justify-center items-center self-stretch" style={{ gap: '82px' }}>
                    <img src={googleIcon} alt="구글" style={{ width: '24px', height: '24px' }} />
                    <span className="title-02 text-gray-900 text-center">Google 계정으로 로그인</span>
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  </div>
                </button>
              </div>

              {/* 로그인 유도 */}
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span className="body-04 text-gray-300">이미 계정이 있으신가요?</span>
                <button type="button" onClick={onLoginClick}>
                  <span className="body-02 text-primary-500">로그인하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
