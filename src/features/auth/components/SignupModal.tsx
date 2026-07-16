import { useState } from 'react';
import closeIcon from '../../../assets/icons/icon-close[14].svg';
import errorIcon from '../../../assets/icons/error.svg';
import kakaoIcon from '../../../assets/icons/icon-kakao.svg';
import googleIcon from '../../../assets/icons/icon-google.svg';

type SignupModalProps = {
  onClose: () => void;
  onLoginClick?: () => void;
  nameError?: string;
  emailError?: string;
  passwordError?: string;
};

const LABEL_STYLE: React.CSSProperties = {
  color: '#15181D',
  fontFamily: 'Pretendard Variable',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.28px',
};

const INPUT_TEXT_STYLE: React.CSSProperties = {
  color: '#15181D',
  fontFamily: 'Pretendard Variable',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '150%',
  letterSpacing: '-0.28px',
};

const BODY04_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '13px',
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.39px',
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
      <path d="M0.699951 0.699951L6.69995 6.69995L0.699951 12.7" stroke="#94A0B4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ color }: { color: string }) {
  return (
    <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.58745 1.0285C7.41199 0.766534 8.2723 0.634619 9.13745 0.637497C12.6922 0.637497 15.1113 2.7625 16.5537 4.6359C17.2762 5.576 17.6375 6.04435 17.6375 7.4375C17.6375 8.8315 17.2762 9.29985 16.5537 10.2391C15.1113 12.1125 12.6922 14.2375 9.13745 14.2375C5.58275 14.2375 3.16365 12.1125 1.7212 10.2391C0.998701 9.3007 0.637451 8.83065 0.637451 7.4375C0.637451 6.0435 0.998701 5.57515 1.7212 4.6359C2.16193 4.0603 2.65258 3.5247 3.18745 3.03535" stroke={color} strokeWidth="1.275" strokeLinecap="round" />
      <path d="M12.5375 7.4376C12.5375 8.33933 12.1793 9.20414 11.5417 9.84176C10.9041 10.4794 10.0393 10.8376 9.13755 10.8376C8.23581 10.8376 7.37101 10.4794 6.73339 9.84176C6.09576 9.20414 5.73755 8.33933 5.73755 7.4376C5.73755 6.53586 6.09576 5.67106 6.73339 5.03343C7.37101 4.39581 8.23581 4.0376 9.13755 4.0376C10.0393 4.0376 10.9041 4.39581 11.5417 5.03343C12.1793 5.67106 12.5375 6.53586 12.5375 7.4376Z" stroke={color} strokeWidth="1.275" />
    </svg>
  );
}

export default function SignupModal({
  onClose,
  onLoginClick,
  nameError,
  emailError,
  passwordError,
}: SignupModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);
  const [isKakaoHovered, setIsKakaoHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const eyeColor = passwordError ? '#FF2A14' : showPassword ? '#0085FF' : '#B8BFCB';

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
      className="inline-flex justify-center items-start"
      style={{ padding: '30px 40px 40px 40px', borderRadius: '16px', background: '#FFF', gap: '4px' }}
      role="dialog"
      aria-modal="true"
    >
      {/* Frame 10660 */}
      <div className="flex flex-col items-center" style={{ gap: '36px' }}>

        {/* S_header_modal */}
        <div className="flex items-center" style={{ width: '400px', gap: '118px' }}>
          <span style={{ width: '257px', height: '24px', flexShrink: 0, color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '18px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.36px' }}>
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

        {/* Frame 10659 */}
        <div className="flex flex-col items-center" style={{ gap: '24px', alignSelf: 'stretch' }}>

          {/* Frame 10658 */}
          <div className="flex flex-col items-center" style={{ gap: '40px', alignSelf: 'stretch' }}>

            {/* signup_form */}
            <div className="flex flex-col items-start" style={{ gap: '16px', alignSelf: 'stretch' }}>

              {/* name_text_field */}
              <div className="flex flex-col items-start" style={{ gap: '6px', alignSelf: 'stretch' }}>
                <span className="self-stretch" style={LABEL_STYLE}>이름</span>
                <div
                  className="flex items-center"
                  onMouseEnter={() => setIsNameHovered(true)}
                  onMouseLeave={() => setIsNameHovered(false)}
                  style={{
                    width: '400px',
                    padding: '12px 16px',
                    gap: '4px',
                    borderRadius: '8px',
                    border: nameError ? '1px solid #FF4633' : '1px solid #E7EAEF',
                    background: isNameHovered ? '#F3F4F6' : '#FFF',
                    transition: 'background 0.15s',
                  }}
                >
                  <input
                    type="text"
                    className="outline-none bg-transparent flex-1"
                    style={{ ...INPUT_TEXT_STYLE, width: '344px', flexShrink: 0 }}
                    placeholder="이름을 입력해주세요"
                  />
                  {nameError && (
                    <div className="flex justify-center items-center" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
                      <img src={errorIcon} alt="오류" style={{ width: '17px', height: '17px' }} />
                    </div>
                  )}
                </div>
                {nameError && (
                  <div className="flex items-center self-stretch" style={{ padding: '0 8px', gap: '4px' }}>
                    <span style={{ flex: '1 0 0', color: '#FF2A14', ...BODY04_STYLE }}>{nameError}</span>
                  </div>
                )}
              </div>

              {/* email_text_field */}
              <div className="flex flex-col items-start" style={{ gap: '6px', alignSelf: 'stretch' }}>
                <span className="self-stretch" style={LABEL_STYLE}>이메일</span>
                <div
                  className="flex items-center"
                  onMouseEnter={() => setIsEmailHovered(true)}
                  onMouseLeave={() => setIsEmailHovered(false)}
                  style={{
                    width: '400px',
                    padding: '12px 16px',
                    gap: '4px',
                    borderRadius: '8px',
                    border: emailError ? '1px solid #FF4633' : '1px solid #E7EAEF',
                    background: isEmailHovered ? '#F3F4F6' : '#FFF',
                    transition: 'background 0.15s',
                  }}
                >
                  <input
                    type="email"
                    className="outline-none bg-transparent flex-1"
                    style={{ ...INPUT_TEXT_STYLE, width: '344px', flexShrink: 0 }}
                    placeholder="이메일을 입력해주세요"
                  />
                  {emailError && (
                    <div className="flex justify-center items-center" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
                      <img src={errorIcon} alt="오류" style={{ width: '17px', height: '17px' }} />
                    </div>
                  )}
                </div>
                {emailError && (
                  <div className="flex items-center self-stretch" style={{ padding: '0 8px', gap: '4px' }}>
                    <span style={{ flex: '1 0 0', color: '#FF2A14', ...BODY04_STYLE }}>{emailError}</span>
                  </div>
                )}
              </div>

              {/* Frame 10656: password_text_field + hint */}
              <div className="flex flex-col items-start" style={{ gap: '8px', alignSelf: 'stretch' }}>

                {/* password_text_field */}
                <div className="flex flex-col items-start" style={{ gap: '6px', alignSelf: 'stretch' }}>
                  <span className="self-stretch" style={LABEL_STYLE}>비밀번호</span>
                  <div
                    className="flex items-center"
                    onMouseEnter={() => setIsPasswordHovered(true)}
                    onMouseLeave={() => setIsPasswordHovered(false)}
                    style={{
                      width: '400px',
                      padding: '12px 16px',
                      gap: '4px',
                      borderRadius: '8px',
                      border: passwordError ? '1px solid #FF4633' : '1px solid #E7EAEF',
                      background: isPasswordHovered ? '#F3F4F6' : '#FFF',
                      transition: 'background 0.15s',
                    }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="flex-1 outline-none bg-transparent"
                      style={{ ...INPUT_TEXT_STYLE, width: '344px', flexShrink: 0 }}
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
                      <span style={{ flex: '1 0 0', color: '#FF2A14', ...BODY04_STYLE }}>{passwordError}</span>
                    </div>
                  )}
                </div>

                {/* Frame 10881: 항상 표시되는 힌트 */}
                <div className="flex items-center" style={{ paddingLeft: '8px', gap: '4px' }}>
                  <span style={{ color: '#94A0B4', ...BODY04_STYLE }}>8자 이상 20자 이하로 입력해 주세요.</span>
                </div>
              </div>
            </div>

            {/* Frame 10886: 동의 + 회원가입 버튼 */}
            <div className="flex flex-col items-start" style={{ gap: '24px', alignSelf: 'stretch' }}>

              {/* Signup_Agreement_Form */}
              <div className="flex flex-col items-start" style={{ width: '380px', gap: '8px' }}>

                {/* Frame 10883: 전체 동의하기 */}
                <div className="flex items-center" style={{ gap: '4px', alignSelf: 'stretch' }}>
                  <button
                    type="button"
                    onClick={handleAgreeAll}
                    className="flex justify-center items-center flex-shrink-0"
                    style={{ width: '20px', height: '20px' }}
                  >
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid #B8BFCB', background: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {agreeAll && <CheckIcon color="#0085FF" />}
                    </div>
                  </button>
                  <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.28px' }}>
                    전체 동의하기
                  </span>
                </div>

                {/* Signup_Agreement_Form (list) */}
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
                        <CheckIcon color={agreeTerms ? '#0085FF' : '#B8BFCB'} />
                      </button>
                      <div className="flex items-center flex-1" style={{ gap: '4px' }}>
                        <span style={{ color: '#2B313B', ...BODY04_STYLE }}>이용약관 동의</span>
                        <span style={{ color: '#0085FF', ...BODY04_STYLE }}>(필수)</span>
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
                        <CheckIcon color={agreePrivacy ? '#0085FF' : '#B8BFCB'} />
                      </button>
                      <div className="flex items-center flex-1" style={{ gap: '4px' }}>
                        <span style={{ color: '#000', ...BODY04_STYLE }}>개인정보 처리방침 동의</span>
                        <span style={{ color: '#0085FF', ...BODY04_STYLE }}>(필수)</span>
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
                className="flex justify-center items-center"
                style={{
                  padding: '13px 169px',
                  borderRadius: '8px',
                  background: '#0085FF',
                  gap: '4px',
                  alignSelf: 'stretch',
                }}
              >
                <span style={{ color: '#FFF', fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}>
                  회원가입
                </span>
              </button>
            </div>
          </div>

          {/* Frame 98: 또는 + 소셜 로그인 + 로그인 유도 */}
          <div className="flex flex-col items-center self-stretch" style={{ gap: '24px' }}>

            {/* Frame 90: 또는 구분선 */}
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div style={{ width: '166px', height: '0.6px', background: '#94A0B4' }} />
              <span style={{ color: '#94A0B4', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 400, lineHeight: '150%', letterSpacing: '-0.28px' }}>
                또는
              </span>
              <div style={{ width: '166px', height: '0.6px', background: '#94A0B4' }} />
            </div>

            {/* Frame 97 */}
            <div className="flex flex-col items-center" style={{ gap: '24px' }}>

              {/* Frame 96: 소셜 로그인 버튼들 */}
              <div className="flex flex-col items-start" style={{ gap: '12px' }}>

                {/* 카카오 로그인 버튼 */}
                <button
                  type="button"
                  className="flex flex-col justify-center items-center"
                  onMouseEnter={() => setIsKakaoHovered(true)}
                  onMouseLeave={() => setIsKakaoHovered(false)}
                  style={{
                    width: '400px',
                    height: '48px',
                    padding: '8px 12px 8px 10px',
                    borderRadius: '8px',
                    background: isKakaoHovered ? '#F5D401' : '#FAE100',
                    gap: '4px',
                    transition: 'background 0.15s',
                  }}
                >
                  <div className="flex justify-center items-center" style={{ width: '350px', gap: '104px' }}>
                    <div className="flex justify-center items-center flex-shrink-0" style={{ width: '24px', height: '24px', padding: '3px 2px' }}>
                      <img src={kakaoIcon} alt="카카오" style={{ width: '20px', height: '18px', flexShrink: 0 }} />
                    </div>
                    <span style={{ width: '96px', height: '24px', flexShrink: 0, color: '#15181D', textAlign: 'center', fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}>
                      카카오 로그인
                    </span>
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  </div>
                </button>

                {/* 구글 로그인 버튼 */}
                <button
                  type="button"
                  className="flex flex-col justify-center items-center"
                  onMouseEnter={() => setIsGoogleHovered(true)}
                  onMouseLeave={() => setIsGoogleHovered(false)}
                  style={{
                    width: '400px',
                    height: '48px',
                    padding: '8px 12px 8px 10px',
                    borderRadius: '8px',
                    background: isGoogleHovered ? '#E7E6E6' : '#F2F2F2',
                    gap: '4px',
                    transition: 'background 0.15s',
                  }}
                >
                  <div className="flex justify-center items-center self-stretch" style={{ gap: '82px' }}>
                    <img src={googleIcon} alt="구글" style={{ width: '24px', height: '24px' }} />
                    <span style={{ color: '#15181D', textAlign: 'center', fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}>
                      Goole 계정으로 로그인
                    </span>
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  </div>
                </button>
              </div>

              {/* Frame 87: 로그인 유도 */}
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span style={{ color: '#B8BFCB', ...BODY04_STYLE }}>이미 계정이 있으신가요?</span>
                <button type="button" onClick={onLoginClick} className="flex items-center">
                  <span style={{ color: '#0085FF', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.28px' }}>
                    로그인하기
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
