import { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';
import closeIcon from '../../../assets/icons/icon-close[14].svg';
import checkboxCheckedIcon from '../../../assets/icons/icon-checkbox-checked.svg';
import kakaoIcon from '../../../assets/icons/icon-kakao.svg';
import googleIcon from '../../../assets/icons/icon-google.svg';
import Input from '../../../shared/components/Input';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

type LoginModalProps = {
  onClose: () => void;
  onSignupClick?: () => void;
  onForgotPasswordClick?: () => void;
};

export default function LoginModal({
  onClose,
  onSignupClick,
  onForgotPasswordClick,
}: LoginModalProps) {
  const signIn = useAuthStore((s) => s.signIn);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);
  const [isKakaoHovered, setIsKakaoHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setEmailError('');
    setPasswordError('');
    setFormError('');

    let hasError = false;
    if (!email) { setEmailError('이메일을 입력해주세요.'); hasError = true; }
    if (!password) { setPasswordError('비밀번호를 입력해주세요.'); hasError = true; }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      await authApi.login({ email, password });
      signIn();
      onClose();
    } catch (error) {
      if (axios.isAxiosError<{ message: string }>(error) && error.response?.status === 401) {
        setFormError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setFormError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      const { authorizationUrl } = await authApi.getGoogleLoginUrl();
      window.location.href = authorizationUrl;
    } catch {
      setIsGoogleLoading(false);
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
          <span
            className="text-gray-900"
            style={{ width: '257px', height: '24px', flexShrink: 0, fontFamily: 'Pretendard Variable', fontSize: '18px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.36px' }}
          >
            로그인
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

        <div className="flex flex-col items-center" style={{ gap: '24px' }}>
          <div className="flex flex-col justify-center items-center">

            {/* 로그인 폼 */}
            <div className="flex flex-col items-start" style={{ gap: '16px' }}>

              {/* 이메일 */}
              <Input
                label="이메일"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
                error={emailError}
              />

              {/* 비밀번호 + 로그인 옵션 */}
              <div className="flex flex-col items-start self-stretch" style={{ gap: '8px' }}>
                <Input
                  label="비밀번호"
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  error={passwordError}
                />

                {/* 로그인 옵션: 로그인 유지 + 비밀번호 찾기 */}
                <div className="flex items-center self-stretch" style={{ gap: '200px' }}>
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setIsRemembered((prev) => !prev)}
                      className="flex justify-center items-center"
                      style={{ width: '24px', height: '24px' }}
                    >
                      {isRemembered ? (
                        <img src={checkboxCheckedIcon} alt="체크됨" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                      ) : (
                        <div className="border border-gray-300 bg-white rounded-1" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                      )}
                    </button>
                    <span className="body-04 text-gray-600">로그인 상태 유지</span>
                  </div>
                  <button type="button" onClick={onForgotPasswordClick} className="body-04 text-primary-500">
                    비밀번호 찾기
                  </button>
                </div>
              </div>
            </div>

            {/* 폼 에러 */}
            {formError && (
              <span
                className="body-02 text-[#FF2A14]"
                style={{ marginTop: '16px', alignSelf: 'flex-start' }}
              >
                {formError}
              </span>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center items-center rounded-2 bg-primary-500 disabled:opacity-50"
              style={{
                marginTop: formError ? '16px' : '26px',
                width: '400px',
                padding: '13px 169px',
                gap: '4px',
              }}
            >
              <span
                className="text-white"
                style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
              >
                {isSubmitting ? '로그인 중...' : '로그인'}
              </span>
            </button>
          </div>

          {/* 소셜 로그인 + 회원가입 */}
          <div className="flex flex-col items-center self-stretch" style={{ gap: '24px' }}>

            {/* 또는 구분선 */}
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="bg-gray-400" style={{ width: '166px', height: '0.6px' }} />
              <span
                className="text-gray-400"
                style={{ fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 400, lineHeight: '150%', letterSpacing: '-0.28px' }}
              >
                또는
              </span>
              <div className="bg-gray-400" style={{ width: '166px', height: '0.6px' }} />
            </div>

            <div className="flex flex-col items-center" style={{ gap: '24px' }}>

              {/* 소셜 로그인 버튼들 */}
              <div className="flex flex-col items-start" style={{ gap: '12px' }}>

                {/* 카카오 로그인 */}
                <button
                  type="button"
                  className="flex flex-col justify-center items-center rounded-2"
                  onMouseEnter={() => setIsKakaoHovered(true)}
                  onMouseLeave={() => setIsKakaoHovered(false)}
                  style={{
                    width: '400px',
                    height: '48px',
                    padding: '8px 12px 8px 10px',
                    background: isKakaoHovered ? '#F5D401' : '#FAE100',
                    gap: '4px',
                    transition: 'background 0.15s',
                  }}
                >
                  <div className="flex justify-center items-center" style={{ width: '350px', gap: '104px' }}>
                    <div className="flex justify-center items-center flex-shrink-0" style={{ width: '24px', height: '24px', padding: '3px 2px' }}>
                      <img src={kakaoIcon} alt="카카오" style={{ width: '20px', height: '18px', flexShrink: 0 }} />
                    </div>
                    <span
                      className="text-gray-900 text-center"
                      style={{ width: '96px', height: '24px', flexShrink: 0, fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
                    >
                      카카오 로그인
                    </span>
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  </div>
                </button>

                {/* 구글 로그인 */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="flex flex-col justify-center items-center rounded-2 disabled:opacity-50"
                  onMouseEnter={() => setIsGoogleHovered(true)}
                  onMouseLeave={() => setIsGoogleHovered(false)}
                  style={{
                    width: '400px',
                    height: '48px',
                    padding: '8px 12px 8px 10px',
                    background: isGoogleHovered ? '#E7E6E6' : '#F2F2F2',
                    gap: '4px',
                    transition: 'background 0.15s',
                  }}
                >
                  <div className="flex justify-center items-center self-stretch" style={{ gap: '82px' }}>
                    <img src={googleIcon} alt="구글" style={{ width: '24px', height: '24px' }} />
                    <span
                      className="text-gray-900 text-center"
                      style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
                    >
                      Google 계정으로 로그인
                    </span>
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  </div>
                </button>
              </div>

              {/* 회원가입 유도 */}
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span className="body-04 text-gray-300">계정이 없으신가요?</span>
                <button type="button" onClick={onSignupClick} className="flex items-center">
                  <span className="body-02 text-primary-500">회원가입하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
