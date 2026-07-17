import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../../../shared/components/Header';
import Footer from '../../../shared/components/Footer';
import mailIcon from '../../../assets/icons/icon-mail.svg';

type Step = 'sent' | 'inputCode' | 'success' | 'expired' | 'limitExceeded' | 'failed';

type EmailVerificationPageProps = {
  email?: string;
  onResend?: () => void;
  onVerify?: (code: string) => Promise<void>;
  onServiceStart?: () => void;
};

const TOTAL_SECONDS = 5 * 60;
const MAX_RESEND = 5;
const CODE_LENGTH = 6;

function BlueFilledButton({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex justify-center items-center self-stretch rounded-lg bg-primary-500 disabled:opacity-50"
      style={{ padding: '13px 0' }}
    >
      <span
        className="text-white"
        style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
      >
        {children}
      </span>
    </button>
  );
}

function RedFilledButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex justify-center items-center self-stretch rounded-lg bg-[#FF2A14]"
      style={{ padding: '13px 0' }}
    >
      <span
        className="text-white"
        style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
      >
        {children}
      </span>
    </button>
  );
}

function OutlineButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex justify-center items-center self-stretch rounded-lg border border-gray-300 bg-white"
      style={{ padding: '13px 0' }}
    >
      <span
        className="text-gray-600"
        style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
      >
        {children}
      </span>
    </button>
  );
}

function MailIcon({ error = false }: { error?: boolean }) {
  return (
    <div
      className={`flex flex-col justify-center items-center flex-shrink-0 rounded-full ${error ? 'bg-[#FFECEB]' : 'bg-gray-50'}`}
      style={{ width: '70px', height: '70px', padding: '14px' }}
    >
      <img
        src={mailIcon}
        alt="이메일"
        style={{ width: '42px', height: '42px', filter: error ? 'invert(22%) sepia(96%) saturate(7239%) hue-rotate(353deg) brightness(101%) contrast(99%)' : undefined }}
      />
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col items-start self-stretch rounded-4 bg-gray-50"
      style={{ padding: '32px 40px', gap: '4px' }}
    >
      {children}
    </div>
  );
}

export default function EmailVerificationPage({
  email = 'example@email.com',
  onResend,
  onVerify,
  onServiceStart,
}: EmailVerificationPageProps) {
  const [step, setStep] = useState<Step>('sent');
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [resendCount, setResendCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(TOTAL_SECONDS);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setStep('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (step === 'inputCode') startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step, startTimer]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const handleCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendCount >= MAX_RESEND) {
      setStep('limitExceeded');
      return;
    }
    setResendCount((c) => c + 1);
    setCode(Array(CODE_LENGTH).fill(''));
    setErrorCount(0);
    setStep('inputCode');
    onResend?.();
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    const fullCode = code.join('');
    if (fullCode.length < CODE_LENGTH) return;
    setIsVerifying(true);
    try {
      await onVerify?.(fullCode);
      setStep('success');
    } catch {
      const nextErrorCount = errorCount + 1;
      setErrorCount(nextErrorCount);
      if (nextErrorCount >= 5) {
        setStep('failed');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const card = (
    <div
      className="flex flex-col items-center rounded-4 bg-white"
      style={{ width: '610px', padding: '60px', gap: '42px' }}
    >

      {/* SENT */}
      {step === 'sent' && (
        <div className="flex flex-col items-start self-stretch" style={{ gap: '30px' }}>
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            <div className="flex flex-col items-center" style={{ gap: '20px' }}>
              <MailIcon />
              <div className="flex flex-col items-center" style={{ width: '344px', gap: '20px' }}>
                <span className="heading-05 text-black self-stretch text-center">
                  인증 메일이 발송되었어요.
                </span>
                <div className="flex flex-col items-center self-stretch" style={{ gap: '2px' }}>
                  <span
                    className="text-gray-700"
                    style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                  >
                    {email}로 인증 메일이 발송되었습니다.
                  </span>
                  <span
                    className="self-stretch text-center text-gray-700"
                    style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                  >
                    이메일 인증 후 정상적인 서비스 이용이 가능합니다.
                  </span>
                </div>
              </div>
            </div>
            <InfoBox>
              <span className="body-04 text-gray-500 self-stretch">인증 메일을 받지 못하셨나요?</span>
              <span className="body-04 text-gray-500 self-stretch">7일 이내에 이메일의 인증 링크를 클릭해 주시면 회원가입이 완료됩니다.</span>
              <span className="body-04 text-gray-500 self-stretch">메일을 받지 못했다면 스팸함을 확인해 주세요.</span>
            </InfoBox>
          </div>
          <div className="flex items-center self-stretch" style={{ gap: '12px' }}>
            <OutlineButton onClick={handleResend}>메일 다시 받기</OutlineButton>
            <BlueFilledButton onClick={() => setStep('inputCode')}>확인</BlueFilledButton>
          </div>
        </div>
      )}

      {/* INPUT CODE */}
      {step === 'inputCode' && (
        <div className="flex flex-col items-start self-stretch" style={{ gap: '30px' }}>
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            <div className="flex flex-col items-center" style={{ gap: '20px' }}>
              <MailIcon />
              <div className="flex flex-col items-center" style={{ width: '344px', gap: '20px' }}>
                <span className="heading-05 text-black self-stretch text-center">
                  인증번호를 입력해 주세요.
                </span>
                <span
                  className="self-stretch text-center text-gray-700"
                  style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                >
                  입력하신 이메일로 인증번호를 보내드렸어요.
                </span>
              </div>
            </div>

            {/* 인증번호 입력 박스 + 타이머 */}
            <div className="flex flex-col items-center self-stretch" style={{ gap: '12px' }}>
              <div className="flex items-center justify-between self-stretch">
                <span className="body-04 text-gray-700">인증번호 6자리</span>
                <span
                  className="text-[#FF2A14]"
                  style={{ fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500 }}
                >
                  {minutes}:{seconds}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: '8px' }}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className={`text-center outline-none rounded-2 bg-white text-gray-900 border ${digit ? 'border-primary-500' : 'border-gray-100'}`}
                    style={{ width: '60px', height: '64px', fontFamily: 'Pretendard Variable', fontSize: '24px', fontWeight: 600 }}
                  />
                ))}
              </div>
            </div>

            <InfoBox>
              <span className="body-04 text-gray-500 self-stretch">인증 메일을 받지 못하셨나요?</span>
              <span className="body-04 text-gray-500 self-stretch">7일 이내에 이메일의 인증 링크를 클릭해 주시면 회원가입이 완료됩니다.</span>
              <span className="body-04 text-gray-500 self-stretch">메일을 받지 못했다면 스팸함을 확인해 주세요.</span>
            </InfoBox>
          </div>
          <div className="flex items-center self-stretch" style={{ gap: '12px' }}>
            <OutlineButton onClick={handleResend}>인증번호 다시 받기</OutlineButton>
            <BlueFilledButton onClick={handleVerify} disabled={isVerifying || code.join('').length < CODE_LENGTH}>
              인증하기
            </BlueFilledButton>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {step === 'success' && (
        <div className="flex flex-col items-start self-stretch" style={{ gap: '30px' }}>
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            <div className="flex flex-col items-center" style={{ gap: '20px' }}>
              <MailIcon />
              <div className="flex flex-col items-center" style={{ width: '344px', gap: '20px' }}>
                <span className="heading-05 text-black self-stretch text-center">
                  이메일 인증이 완료되었어요.
                </span>
                <div className="flex flex-col items-center self-stretch" style={{ gap: '2px' }}>
                  <span
                    className="self-stretch text-center text-gray-700"
                    style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                  >
                    이메일 인증이 정상적으로 완료되었습니다.
                  </span>
                  <span
                    className="self-stretch text-center text-gray-700"
                    style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                  >
                    이제 OMO 서비스를 안전하게 이용할 수 있습니다.
                  </span>
                </div>
              </div>
            </div>
            <InfoBox>
              <span className="body-04 text-gray-500 self-stretch">인증된 이메일로 안내를 받을 수 있어요</span>
              <span className="body-04 text-gray-500 self-stretch">비밀번호 재설정, 보안 알림, 중요 알림이 해당 이메일로 발송됩니다.</span>
            </InfoBox>
          </div>
          <BlueFilledButton onClick={onServiceStart}>서비스 이용하기</BlueFilledButton>
        </div>
      )}

      {/* EXPIRED */}
      {step === 'expired' && (
        <div className="flex flex-col items-start self-stretch" style={{ gap: '30px' }}>
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            <div className="flex flex-col items-center" style={{ gap: '20px' }}>
              <MailIcon error />
              <div className="flex flex-col items-center" style={{ width: '344px', gap: '20px' }}>
                <span className="heading-05 text-black self-stretch text-center">
                  인증 시간이 만료되었어요
                </span>
                <span
                  className="self-stretch text-center text-gray-700"
                  style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                >
                  새 인증번호를 받아 다시 인증해 주세요.
                </span>
              </div>

              {/* 만료된 코드 표시 */}
              <div className="flex flex-col items-center self-stretch" style={{ gap: '12px' }}>
                <div className="flex items-center justify-between self-stretch">
                  <span className="body-04 text-gray-700">인증번호 6자리</span>
                  <span className="text-[#FF2A14]" style={{ fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500 }}>
                    00:00
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: '8px' }}>
                  {Array(CODE_LENGTH).fill('0').map((digit, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center rounded-2 border border-gray-100 bg-gray-50 text-gray-300"
                      style={{ width: '60px', height: '64px', fontFamily: 'Pretendard Variable', fontSize: '24px', fontWeight: 600 }}
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <InfoBox>
              <span className="body-04 text-gray-500 self-stretch">인증 메일을 받지 못하셨나요?</span>
              <span className="body-04 text-gray-500 self-stretch">7일 이내에 이메일의 인증 링크를 클릭해 주시면 회원가입이 완료됩니다.</span>
              <span className="body-04 text-gray-500 self-stretch">메일을 받지 못했다면 스팸함을 확인해 주세요.</span>
            </InfoBox>
          </div>
          <RedFilledButton onClick={handleResend}>인증 메일 다시 받기</RedFilledButton>
        </div>
      )}

      {/* LIMIT EXCEEDED */}
      {step === 'limitExceeded' && (
        <div className="flex flex-col items-start self-stretch" style={{ gap: '30px' }}>
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            <div className="flex flex-col items-center" style={{ gap: '20px' }}>
              <MailIcon error />
              <div className="flex flex-col items-center" style={{ width: '344px', gap: '20px' }}>
                <span className="heading-05 text-black self-stretch text-center">
                  인증번호 요청 횟수를 초과했어요.
                </span>
                <span
                  className="self-stretch text-center text-gray-700"
                  style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                >
                  보안을 위해 인증번호 재전송이 잠시 제한되었어요.
                </span>
              </div>
            </div>
            <InfoBox>
              <span className="body-04 text-gray-500 self-stretch">인증 메일을 받지 못하셨나요?</span>
              <span className="body-04 text-gray-500 self-stretch">문제가 계속되면 고객센터 0000-0000으로 문의해 주세요.</span>
            </InfoBox>
          </div>
          <div className="flex items-center self-stretch" style={{ gap: '12px' }}>
            <OutlineButton onClick={() => setStep('sent')}>닫기</OutlineButton>
            <RedFilledButton onClick={handleResend}>인증 번호 다시 받기</RedFilledButton>
          </div>
        </div>
      )}

      {/* FAILED */}
      {step === 'failed' && (
        <div className="flex flex-col items-start self-stretch" style={{ gap: '30px' }}>
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            <div className="flex flex-col items-center" style={{ gap: '20px' }}>
              <MailIcon error />
              <div className="flex flex-col items-center" style={{ width: '344px', gap: '20px' }}>
                <span className="heading-05 text-black self-stretch text-center">
                  이메일 인증에 실패했어요.
                </span>
                <div className="flex flex-col items-center self-stretch" style={{ gap: '2px' }}>
                  <span
                    className="self-stretch text-center text-gray-700"
                    style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                  >
                    인증 시간이 만료되거나, 인증번호가 올바르지 않아요.
                  </span>
                  <span
                    className="self-stretch text-center text-gray-700"
                    style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                  >
                    인증번호를 다시 확인하거나 새 인증번호를 받아주세요.
                  </span>
                </div>
              </div>
            </div>
            <InfoBox>
              <span className="body-04 text-gray-500 self-stretch">인증번호를 다시 확인해 주세요.</span>
              <span className="body-04 text-gray-500 self-stretch">입력한 인증번호가 이메일로 받은 번호의 일치하는지 확인해 주세요.</span>
              <span className="body-04 text-gray-500 self-stretch">계속 실패할 경우 인증번호를 다시 받아 진행해 주세요.</span>
            </InfoBox>
          </div>
          <RedFilledButton onClick={handleResend}>인증 번호 다시 받기</RedFilledButton>
        </div>
      )}

    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header isLoggedIn={false} />
      <main className="flex flex-1 justify-center items-center py-[100px]">
        {card}
      </main>
      <Footer />
    </div>
  );
}
