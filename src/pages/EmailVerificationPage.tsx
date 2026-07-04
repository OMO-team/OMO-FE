import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

type EmailVerificationPageProps = {
  email?: string;
  onResend?: () => void;
};

const BODY04_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '13px',
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.39px',
  color: '#6B7A94',
  alignSelf: 'stretch',
};

export default function EmailVerificationPage({
  email = 'example@email.com',
  onResend,
}: EmailVerificationPageProps) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F3F4F6' }}>
      <Header showProfile />

      {/* 본문 */}
      <main className="flex flex-1 justify-center items-center py-[100px]">

        {/* Verification_Mail_Modal */}
        <div
          className="flex flex-col items-center"
          style={{
            width: '610px',
            padding: '60px 60px 54px 60px',
            gap: '42px',
            borderRadius: '16px',
            background: '#FFF',
          }}
        >
          {/* Frame 10914 */}
          <div className="flex flex-col items-start self-stretch" style={{ gap: '30px' }}>

            {/* Frame 10913 */}
            <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>

              {/* Frame 10912 */}
              <div className="flex flex-col items-center" style={{ gap: '20px' }}>

                {/* Icon_Email */}
                <div
                  className="flex flex-col justify-center items-center flex-shrink-0"
                  style={{
                    width: '70px',
                    height: '70px',
                    padding: '14px',
                    borderRadius: '100px',
                    background: '#F3F4F6',
                    gap: '4px',
                  }}
                >
                  <img
                    src="/src/assets/icons/icon-mail.svg"
                    alt="이메일"
                    style={{ width: '42px', height: '42px', flexShrink: 0 }}
                  />
                </div>

                {/* Frame 10909 */}
                <div className="flex flex-col items-center" style={{ width: '344px', gap: '20px' }}>

                  {/* 인증 메일이 발송되었어요. */}
                  <span
                    className="self-stretch text-center"
                    style={{
                      color: '#000',
                      fontFamily: 'Pretendard Variable',
                      fontSize: '22px',
                      fontWeight: 600,
                      lineHeight: '140%',
                      letterSpacing: '-0.66px',
                    }}
                  >
                    인증 메일이 발송되었어요.
                  </span>

                  {/* Text_Description */}
                  <div className="flex flex-col items-center self-stretch" style={{ gap: '2px' }}>

                    {/* Frame 10906: 이메일 주소 + "로 인증 메일이 발송되었습니다." */}
                    <div className="flex items-center self-stretch">
                      <div className="flex items-center">
                        <span
                          style={{
                            color: '#404959',
                            fontFamily: 'Pretendard Variable',
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: '140%',
                            letterSpacing: '-0.32px',
                          }}
                        >
                          {email}
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#404959',
                          fontFamily: 'Pretendard Variable',
                          fontSize: '16px',
                          fontWeight: 400,
                          lineHeight: '140%',
                          letterSpacing: '-0.32px',
                        }}
                      >
                        로 인증 메일이 발송되었습니다.
                      </span>
                    </div>

                    {/* 이메일 인증 후 정상적인 서비스 이용이 가능합니다. */}
                    <span
                      className="self-stretch text-center"
                      style={{
                        color: '#404959',
                        fontFamily: 'Pretendard Variable',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '140%',
                        letterSpacing: '-0.32px',
                      }}
                    >
                      이메일 인증 후 정상적인 서비스 이용이 가능합니다.
                    </span>
                  </div>
                </div>
              </div>

              {/* Info_Description */}
              <div
                className="flex flex-col items-start self-stretch"
                style={{
                  padding: '32px 40px',
                  gap: '4px',
                  borderRadius: '16px',
                  background: '#F3F4F6',
                }}
              >
                {/* Text_Info_Description */}
                <div className="flex flex-col items-start self-stretch" style={{ gap: '2px' }}>
                  <span style={BODY04_STYLE}>인증 메일을 받지 못하셨나요?</span>
                  <span style={BODY04_STYLE}>
                    7일 이내에 이메일의 인증 링크를 클릭해 주시면 회원가입이 완료됩니다.
                  </span>
                  <span style={BODY04_STYLE}>메일을 받지 못했다면 스팸함을 확인해 주세요.</span>
                </div>
              </div>
            </div>

            {/* L_button */}
            <div className="flex items-start" style={{ height: '48px' }}>
              <button
                type="button"
                onClick={onResend}
                className="flex justify-center items-center"
                style={{
                  width: '490px',
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
                  인증 메일 다시 받기
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
