import { useState } from 'react';
import closeIcon from '../../../assets/icons/icon-close[14].svg';
import errorIcon from '../../../assets/icons/error.svg';
import kakaoIcon from '../../../assets/icons/icon-kakao.svg';
import googleIcon from '../../../assets/icons/icon-google.svg';
import EyeIcon from '../../../shared/components/EyeIcon';

type SignupModalProps = {
  onClose: () => void;
  onLoginClick?: () => void;
  nameError?: string;
  emailError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
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

export default function SignupModal({
  onClose,
  onLoginClick,
  nameError,
  emailError,
  passwordError,
  confirmPasswordError,
}: SignupModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isKakaoHovered, setIsKakaoHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const eyeColor = passwordError ? 'var(--color-warning-400)' : showPassword ? 'var(--color-primary-500)' : 'var(--color-gray-300)';

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

              {/* 이름 필드 */}
              <div className="flex flex-col items-start" style={{ gap: '6px', alignSelf: 'stretch' }}>
                <span className="body-02 text-gray-900 self-stretch">이름</span>
                <div
                  className={`flex items-center rounded-2 bg-white hover:bg-gray-50 transition-colors border ${nameError ? 'border-warning-400' : 'border-gray-100'}`}
                  style={{ width: '400px', padding: '12px 16px', gap: '4px' }}
                >
                  <input
                    type="text"
                    className="outline-none bg-transparent flex-1 body-03 text-gray-900 placeholder:text-gray-400"
                    style={{ width: '344px', flexShrink: 0 }}
                    placeholder="이름을 입력해주세요"
                  />
                  {nameError && (
                    <div className="flex justify-center items-center flex-shrink-0" style={{ width: '20px', height: '20px' }}>
                      <img src={errorIcon} alt="오류" style={{ width: '17px', height: '17px' }} />
                    </div>
                  )}
                </div>
                {nameError && (
                  <div className="flex items-center self-stretch" style={{ padding: '0 8px', gap: '4px' }}>
                    <span className="body-04 text-[#FF2A14]" style={{ flex: '1 0 0' }}>{nameError}</span>
                  </div>
                )}
              </div>

              {/* 이메일 필드 */}
              <div className="flex flex-col items-start" style={{ gap: '6px', alignSelf: 'stretch' }}>
                <span className="body-02 text-gray-900 self-stretch">이메일</span>
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

              {/* 비밀번호 필드 + 힌트 */}
              <div className="flex flex-col items-start" style={{ gap: '8px', alignSelf: 'stretch' }}>
                <div className="flex flex-col items-start" style={{ gap: '6px', alignSelf: 'stretch' }}>
                  <span className="body-02 text-gray-900 self-stretch">비밀번호</span>
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

                  {/* 비밀번호 확인 필드 */}
                  <div
                    className={`flex items-center rounded-2 bg-white hover:bg-gray-50 transition-colors border ${confirmPasswordError ? 'border-warning-400' : 'border-gray-100'}`}
                    style={{ width: '400px', padding: '12px 16px', gap: '4px', marginTop: '6px' }}
                  >
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="flex-1 outline-none bg-transparent body-03 text-gray-900 placeholder:text-gray-400"
                      style={{ width: '344px', flexShrink: 0 }}
                      placeholder="비밀번호를 다시 입력해주세요"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="flex justify-center items-center flex-shrink-0"
                      style={{ width: '20px', height: '20px', aspectRatio: '1/1' }}
                    >
                      <EyeIcon color={confirmPasswordError ? 'var(--color-warning-400)' : showConfirmPassword ? 'var(--color-primary-500)' : 'var(--color-gray-300)'} />
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <div className="flex items-center self-stretch" style={{ padding: '0 8px', gap: '4px' }}>
                      <span className="body-04 text-[#FF2A14]" style={{ flex: '1 0 0' }}>{confirmPasswordError}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center" style={{ paddingLeft: '8px', gap: '4px' }}>
                  <span className="body-04 text-gray-400">8자 이상 20자 이하로 입력해 주세요.</span>
                </div>
              </div>
            </div>

            {/* 동의 + 회원가입 버튼 */}
            <div className="flex flex-col items-start" style={{ gap: '24px', alignSelf: 'stretch' }}>

              <div className="flex flex-col items-start" style={{ width: '380px', gap: '8px' }}>

                {/* 전체 동의하기 */}
                <div className="flex items-center" style={{ gap: '4px', alignSelf: 'stretch' }}>
                  <button
                    type="button"
                    onClick={handleAgreeAll}
                    className="flex justify-center items-center flex-shrink-0"
                    style={{ width: '20px', height: '20px' }}
                  >
                    <div className="flex justify-center items-center border border-gray-300 bg-white rounded-1" style={{ width: '18px', height: '18px' }}>
                      {agreeAll && <CheckIcon color="var(--color-primary-500)" />}
                    </div>
                  </button>
                  <span className="body-02 text-gray-900">전체 동의하기</span>
                </div>

                <div className="flex flex-col items-start" style={{ gap: '8px', alignSelf: 'stretch' }}>

                  {/* 이용약관 동의 */}
                  <div className="flex items-center" style={{ paddingTop: '6px', alignSelf: 'stretch' }}>
                    <div className="flex items-center" style={{ width: '360px', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleAgreeTerms}
                        className="flex justify-center items-center flex-shrink-0"
                        style={{ width: '20px', height: '20px' }}
                      >
                        <CheckIcon color={agreeTerms ? 'var(--color-primary-500)' : 'var(--color-gray-300)'} />
                      </button>
                      <div className="flex items-center flex-1" style={{ gap: '4px' }}>
                        <span className="body-04 text-gray-800">이용약관 동의</span>
                        <span className="body-04 text-primary-500">(필수)</span>
                      </div>
                      <button
                        type="button"
                        className="flex justify-center items-center flex-shrink-0"
                        style={{ width: '20px', height: '20px' }}
                      >
                        <ArrowIcon />
                      </button>
                    </div>
                  </div>

                  {/* 개인정보 처리방침 동의 */}
                  <div className="flex items-center" style={{ paddingTop: '6px', alignSelf: 'stretch' }}>
                    <div className="flex items-center" style={{ width: '360px', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleAgreePrivacy}
                        className="flex justify-center items-center flex-shrink-0"
                        style={{ width: '20px', height: '20px' }}
                      >
                        <CheckIcon color={agreePrivacy ? 'var(--color-primary-500)' : 'var(--color-gray-300)'} />
                      </button>
                      <div className="flex items-center flex-1" style={{ gap: '4px' }}>
                        <span className="body-04 text-black">개인정보 처리방침 동의</span>
                        <span className="body-04 text-primary-500">(필수)</span>
                      </div>
                      <button
                        type="button"
                        className="flex justify-center items-center flex-shrink-0"
                        style={{ width: '20px', height: '20px' }}
                      >
                        <ArrowIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <button
                type="button"
                className="flex justify-center items-center rounded-2 bg-primary-500"
                style={{ padding: '13px 169px', gap: '4px', alignSelf: 'stretch' }}
              >
                <span
                  className="text-white"
                  style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
                >
                  회원가입
                </span>
              </button>
            </div>
          </div>

          {/* 또는 + 소셜 로그인 + 로그인 유도 */}
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

              {/* 로그인 유도 */}
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span className="body-04 text-gray-300">이미 계정이 있으신가요?</span>
                <button type="button" onClick={onLoginClick} className="flex items-center">
                  <span className="body-02 text-primary-500">로그인하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
