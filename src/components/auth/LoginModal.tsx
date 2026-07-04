import { useState } from 'react';

type LoginModalProps = {
  onClose: () => void;
  onSignupClick?: () => void;
};

export default function LoginModal({ onClose, onSignupClick }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);

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
          <span
            style={{
              width: '257px',
              height: '24px',
              flexShrink: 0,
              color: '#15181D',
              fontFamily: 'Pretendard Variable',
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: '140%',
              letterSpacing: '-0.36px',
            }}
          >
            로그인
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex justify-center items-center flex-shrink-0"
            style={{ width: '24px', height: '24px' }}
          >
            <img src="/src/assets/icons/Vector_X.svg" alt="닫기" style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        {/* Frame 10659 */}
        <div className="flex flex-col items-center" style={{ gap: '24px' }}>

          {/* Frame 10658 */}
          <div className="flex flex-col justify-center items-center" style={{ gap: '26px' }}>

            {/* login_form */}
            <div className="flex flex-col items-start" style={{ gap: '16px' }}>

              {/* email_text_field */}
              <div className="flex flex-col items-start self-stretch" style={{ gap: '6px' }}>
                <span
                  className="self-stretch"
                  style={{
                    color: '#000',
                    fontFamily: 'Pretendard Variable',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '140%',
                    letterSpacing: '-0.28px',
                  }}
                >
                  이메일
                </span>
                <div
                  className="flex items-center"
                  style={{
                    width: '400px',
                    padding: '12px 16px',
                    gap: '4px',
                    borderRadius: '8px',
                    border: '1px solid #E7EAEF',
                    background: '#FFF',
                  }}
                >
                  <input
                    type="email"
                    className="outline-none bg-transparent"
                    style={{
                      width: '344px',
                      flexShrink: 0,
                      color: '#15181D',
                      fontFamily: 'Pretendard Variable',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '150%',
                      letterSpacing: '-0.28px',
                    }}
                    placeholder="이메일을 입력해주세요"
                  />
                </div>
              </div>

              {/* Frame 10656: password + login_option */}
              <div className="flex flex-col items-start self-stretch" style={{ gap: '8px' }}>

                {/* password_text_field */}
                <div className="flex flex-col items-start self-stretch" style={{ gap: '6px' }}>
                  <span
                    className="self-stretch"
                    style={{
                      color: '#000',
                      fontFamily: 'Pretendard Variable',
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '140%',
                      letterSpacing: '-0.28px',
                    }}
                  >
                    비밀번호
                  </span>
                  <div
                    className="flex items-center"
                    style={{
                      width: '400px',
                      padding: '12px 16px',
                      gap: '4px',
                      borderRadius: '8px',
                      border: '1px solid #E7EAEF',
                      background: '#FFF',
                    }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="flex-1 outline-none bg-transparent"
                      style={{
                        width: '344px',
                        flexShrink: 0,
                        color: '#15181D',
                        fontFamily: 'Pretendard Variable',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '150%',
                        letterSpacing: '-0.28px',
                      }}
                      placeholder="비밀번호를 입력해주세요"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex justify-center items-center flex-shrink-0"
                      style={{ width: '20px', height: '20px', aspectRatio: '1/1' }}
                    >
                      <img
                        src="/src/assets/icons/icon-hiding.svg"
                        alt="비밀번호 표시"
                        style={{ width: '17px', height: '13.6px', flexShrink: 0 }}
                      />
                    </button>
                  </div>
                </div>

                {/* login_option */}
                <div className="flex items-center self-stretch" style={{ gap: '200px' }}>
                  {/* remember_me_checkbox */}
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setIsRemembered((prev) => !prev)}
                      className="flex justify-center items-center"
                      style={{ width: '24px', height: '24px' }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          flexShrink: 0,
                          borderRadius: '4px',
                          border: isRemembered ? 'none' : '1px solid #B8BFCB',
                          background: isRemembered ? '#0085FF' : '#FFF',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {isRemembered && (
                          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                            <path d="M1 4L4.5 7.5L11 1" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                    <span
                      style={{
                        color: '#566276',
                        fontFamily: 'Pretendard Variable',
                        fontSize: '13px',
                        fontWeight: 400,
                        lineHeight: '140%',
                        letterSpacing: '-0.39px',
                      }}
                    >
                      로그인 상태 유지
                    </span>
                  </div>

                  {/* 비밀번호 찾기 */}
                  <button
                    type="button"
                    style={{
                      color: '#0085FF',
                      fontFamily: 'Pretendard Variable',
                      fontSize: '13px',
                      fontWeight: 400,
                      lineHeight: '140%',
                      letterSpacing: '-0.39px',
                    }}
                  >
                    비밀번호 찾기
                  </button>
                </div>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="button"
              className="flex justify-center items-center"
              style={{
                width: '400px',
                padding: '13px 169px',
                borderRadius: '8px',
                background: '#0085FF',
                gap: '4px',
              }}
            >
              <span
                style={{
                  color: '#FFF',
                  fontFamily: 'Pretendard Variable',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  letterSpacing: '-0.32px',
                }}
              >
                로그인
              </span>
            </button>
          </div>

          {/* Frame 98: 또는 + 소셜 로그인 + 회원가입 */}
          <div className="flex flex-col items-center self-stretch" style={{ gap: '24px' }}>

            {/* Frame 90: 또는 구분선 */}
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div style={{ width: '166px', height: '0.6px', background: '#94A0B4' }} />
              <span
                style={{
                  color: '#94A0B4',
                  fontFamily: 'Pretendard Variable',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '150%',
                  letterSpacing: '-0.28px',
                }}
              >
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
                  style={{
                    width: '400px',
                    height: '48px',
                    padding: '8px 12px 8px 10px',
                    borderRadius: '8px',
                    background: '#FAE100',
                    gap: '4px',
                  }}
                >
                  <div className="flex justify-center items-center" style={{ width: '350px', gap: '104px' }}>
                    <div
                      className="flex justify-center items-center flex-shrink-0"
                      style={{ width: '24px', height: '24px', padding: '3px 2px' }}
                    >
                      <img
                        src="/src/assets/icons/icon-kakao.svg"
                        alt="카카오"
                        style={{ width: '20px', height: '18px', flexShrink: 0 }}
                      />
                    </div>
                    <span
                      style={{
                        width: '96px',
                        height: '24px',
                        flexShrink: 0,
                        color: '#15181D',
                        textAlign: 'center',
                        fontFamily: 'Pretendard Variable',
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: '140%',
                        letterSpacing: '-0.32px',
                      }}
                    >
                      카카오 로그인
                    </span>
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  </div>
                </button>

                {/* 구글 로그인 버튼 */}
                <button
                  type="button"
                  className="flex flex-col justify-center items-center"
                  style={{
                    width: '400px',
                    height: '48px',
                    padding: '8px 12px 8px 10px',
                    borderRadius: '8px',
                    background: '#F2F2F2',
                    gap: '4px',
                  }}
                >
                  <div className="flex justify-center items-center self-stretch" style={{ gap: '82px' }}>
                    <img
                      src="/src/assets/icons/icon-google.svg"
                      alt="구글"
                      style={{ width: '24px', height: '24px' }}
                    />
                    <span
                      style={{
                        color: '#15181D',
                        textAlign: 'center',
                        fontFamily: 'Pretendard Variable',
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: '140%',
                        letterSpacing: '-0.32px',
                      }}
                    >
                      Goole 계정으로 로그인
                    </span>
                    <div style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                  </div>
                </button>
              </div>

              {/* Frame 87: 회원가입 유도 */}
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span
                  style={{
                    color: '#B8BFCB',
                    fontFamily: 'Pretendard Variable',
                    fontSize: '13px',
                    fontWeight: 400,
                    lineHeight: '140%',
                    letterSpacing: '-0.39px',
                  }}
                >
                  계정이 없으신가요?
                </span>
                <button
                  type="button"
                  onClick={onSignupClick}
                  className="flex items-center"
                >
                  <span
                    style={{
                      color: '#0085FF',
                      fontFamily: 'Pretendard Variable',
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '140%',
                      letterSpacing: '-0.28px',
                    }}
                  >
                    회원가입하기
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
