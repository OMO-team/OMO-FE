import { useState } from 'react';
import closeIcon from '../../../assets/icons/icon-close[14].svg';
import errorIcon from '../../../assets/icons/error.svg';
import checkboxCheckedIcon from '../../../assets/icons/icon-checkbox-checked.svg';
import kakaoIcon from '../../../assets/icons/icon-kakao.svg';
import googleIcon from '../../../assets/icons/icon-google.svg';
import EyeIcon from '../../../shared/components/EyeIcon';

type LoginModalProps = {
  onClose: () => void;
  onSignupClick?: () => void;
  onForgotPasswordClick?: () => void;
  emailError?: string;
  passwordError?: string;
  formError?: string;
};

export default function LoginModal({
  onClose,
  onSignupClick,
  onForgotPasswordClick,
  emailError,
  passwordError,
  formError,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);
  const [isKakaoHovered, setIsKakaoHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);

  const eyeColor = passwordError ? '#FF2A14' : showPassword ? 'var(--color-primary-500)' : 'var(--color-gray-300)';

  return (
    <div
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

              {/* 이메일 필드 */}
              <div className="flex flex-col items-start self-stretch" style={{ gap: '6px' }}>
                <span className="body-02 text-black self-stretch">이메일</span>
                <div
                  className={`flex items-center rounded-2 bg-white hover:bg-gray-50 transition-colors border ${emailError ? 'border-warning-400' : 'border-gray-100'}`}
                  style={{ width: '400px', padding: '12px 16px', gap: '4px' }}
                >
                  <input
                    type="email"
                    className="outline-none bg-transparent flex-1 body-03 text-gray-900 placeholder:text-gray-400"
                    style={{ width: '344px', flexShrink: 0 }}
                    placeholder="이메일을 입력해주세요"
                  />
                  {emailError && (
                    <div className="flex justify-center items-center flex-shrink-0" style={{ width: '20px', height: '20px' }}>
                      <img src={errorIcon} alt="오류" style={{ width: '17px', height: '17px' }} />
                    </div>
                  )}
                </div>
                {emailError && (
                  <div className="flex items-center self-stretch" style={{ padding: '0 8px', gap: '4px' }}>
                    <span className="body-04 text-[#FF2A14]" style={{ flex: '1 0 0' }}>{emailError}</span>
                  </div>
                )}
              </div>

              {/* 비밀번호 + 로그인 옵션 */}
              <div className="flex flex-col items-start self-stretch" style={{ gap: '8px' }}>

                {/* 비밀번호 필드 */}
                <div className="flex flex-col items-start self-stretch" style={{ gap: '6px' }}>
                  <span className="body-02 text-black self-stretch">비밀번호</span>
                  <div
                    className={`flex items-center rounded-2 bg-white hover:bg-gray-50 transition-colors border ${passwordError ? 'border-warning-400' : 'border-gray-100'}`}
                    style={{ width: '400px', padding: '12px 16px', gap: '4px' }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="flex-1 outline-none bg-transparent body-03 text-gray-900 placeholder:text-gray-400"
                      style={{ width: '344px', flexShrink: 0 }}
                      placeholder="비밀번호를 입력해주세요"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex justify-center items-center flex-shrink-0"
                      style={{ width: '20px', height: '20px', aspectRatio: '1/1' }}
                    >
                      <EyeIcon color={eyeColor} />
                    </button>
                  </div>
                  {passwordError && (
                    <div className="flex items-center self-stretch" style={{ padding: '0 8px', gap: '4px' }}>
                      <span className="body-04 text-[#FF2A14]" style={{ flex: '1 0 0' }}>{passwordError}</span>
                    </div>
                  )}
                </div>

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
              type="button"
              className="flex justify-center items-center rounded-2 bg-primary-500"
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
                로그인
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
                  className="flex flex-col justify-center items-center rounded-2"
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
    </div>
  );
}
