import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import axios from 'axios';
import LargeFillButton from '../../../shared/components/LargeFillButton';
import mailIcon from '../../../assets/icons/icon-mail.svg';

type Step = 'sent' | 'inputCode' | 'success' | 'expired' | 'limitExceeded' | 'failed';

type EmailVerificationPageProps = {
  email?: string;
  initialSeconds?: number;
  onResend?: () => Promise<number | undefined> | void;
  onVerify?: (code: string) => Promise<void>;
  onServiceStart?: () => void;
  /** 인증 완료 화면의 안내 문구 — 회원가입/비밀번호 재설정 등 흐름마다 다르게 넘길 수 있음 */
  successDescription?: string;
  /** 인증 완료 화면의 버튼 라벨 */
  successButtonLabel?: string;
};

const TOTAL_SECONDS = 5 * 60;
const MAX_RESEND = 5;
const CODE_LENGTH = 6;

function MailIcon({ error = false }: { error?: boolean }) {
  return (
    <div
      className={`flex flex-col justify-center items-center flex-shrink-0 rounded-full ${error ? 'bg-red-50' : 'bg-gray-50'}`}
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
      style={{ padding: '32px clamp(16px, 6vw, 40px)', gap: '4px' }}
    >
      {children}
    </div>
  );
}

const descStyle: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.32px',
};

export default function EmailVerificationPage({
  email = 'example@email.com',
  initialSeconds = TOTAL_SECONDS,
  onResend,
  onVerify,
  onServiceStart,
  successDescription = '이제 OMO 서비스를 안전하게 이용할 수 있습니다.',
  successButtonLabel = '서비스 이용하기',
}: EmailVerificationPageProps) {
  const [step, setStep] = useState<Step>('sent');
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [resendCount, setResendCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [resendError, setResendError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialSecondsRef = useRef(initialSeconds);

  const startTimer = useCallback((seconds?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = seconds ?? initialSecondsRef.current;
    setSecondsLeft(duration);
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
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const handleCodeChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 1) {
      const next = [...code];
      digits.split('').slice(0, CODE_LENGTH - index).forEach((d, i) => { next[index + i] = d; });
      setCode(next);
      inputRefs.current[Math.min(index + digits.length, CODE_LENGTH - 1)]?.focus();
      return;
    }
    const digit = digits.slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCount >= MAX_RESEND) {
      setStep('limitExceeded');
      return;
    }
    const prevStep = step;
    setResendCount((c) => c + 1);
    setCode(Array(CODE_LENGTH).fill(''));
    setErrorCount(0);
    setResendError('');
    setStep('inputCode');
    try {
      const seconds = await onResend?.();
      startTimer(typeof seconds === 'number' ? seconds : undefined);
    } catch {
      setResendCount((c) => c - 1);
      setStep(prevStep);
      setResendError('이메일 발송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    const fullCode = code.join('');
    if (fullCode.length < CODE_LENGTH) return;
    setIsVerifying(true);
    try {
      await onVerify?.(fullCode);
      setStep('success');
    } catch (error) {
      if (axios.isAxiosError<{ code?: string }>(error)) {
        const code = error.response?.data?.code;
        if (error.response?.status === 429 || code === 'AUTH429_1') {
          setStep('limitExceeded');
        } else if (code === 'AUTH400_1') {
          setStep('expired');
        } else {
          const nextErrorCount = errorCount + 1;
          setErrorCount(nextErrorCount);
          if (nextErrorCount >= 5) setStep('failed');
        }
      } else {
        const nextErrorCount = errorCount + 1;
        setErrorCount(nextErrorCount);
        if (nextErrorCount >= 5) setStep('failed');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const codeBoxes = (expired = false) => (
    <div className="flex w-full max-w-[296px] items-center justify-center" style={{ gap: '4px' }}>
      {code.map((digit, i) => (
        expired ? (
          <div
            key={i}
            className="flex shrink-0 items-center justify-center rounded-xl border bg-white"
            style={{
              width: 'clamp(28px, 8vw, 46px)',
              height: 'clamp(38px, 10.5vw, 60px)',
              borderColor: 'var(--color-red-300)',
              color: 'var(--color-red-300)',
              fontFamily: 'Pretendard Variable',
              fontSize: 'clamp(16px, 4vw, 22px)',
              fontWeight: 600,
              lineHeight: '140%',
              letterSpacing: '-0.66px',
            }}
          >
            0
          </div>
        ) : (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(i, e.target.value)}
            onKeyDown={(e) => handleCodeKeyDown(i, e)}
            aria-label={`인증번호 ${i + 1}번째 자리`}
            autoComplete="one-time-code"
            className={`shrink-0 text-center outline-none rounded-xl bg-white text-gray-900 border ${digit ? 'border-primary-500' : 'border-gray-200'}`}
            style={{
              width: 'clamp(28px, 8vw, 46px)',
              height: 'clamp(38px, 10.5vw, 60px)',
              fontFamily: 'Pretendard Variable',
              fontSize: 'clamp(16px, 4vw, 24px)',
              fontWeight: 600,
            }}
          />
        )
      ))}
    </div>
  );

  const card = (
    <div
      className="flex w-full max-w-[610px] flex-col items-center rounded-4 bg-white"
      style={{ padding: 'clamp(24px, 8vw, 60px)', gap: '42px' }}
    >

      {/* SENT */}
      {step === 'sent' && (
        <div className="flex flex-col items-start self-stretch gap-[40px]">
          <div className="flex flex-col items-center self-stretch gap-[40px]">
            {/* MailIcon + 제목/설명 */}
            <div className="flex flex-col items-center self-stretch gap-[20px]">
              <MailIcon />
              <div className="flex flex-col items-center justify-center gap-2 self-stretch">
                <span className="heading-05 text-black self-stretch text-center px-[clamp(16px,10vw,96px)]">
                  인증 메일이 발송되었어요.
                </span>
                <div className="flex flex-col items-center self-stretch" style={{ gap: '2px' }}>
                  <div className="flex flex-wrap items-center justify-center self-stretch">
                    <span className="text-gray-700 break-all" style={descStyle}>{email}</span>
                    <span className="text-gray-700" style={descStyle}>로 인증 메일이 발송되었습니다.</span>
                  </div>
                  <span className="self-stretch text-center text-gray-700" style={descStyle}>
                    이메일 인증 후 정상적인 서비스 이용이 가능합니다.
                  </span>
                </div>
              </div>
            </div>
            <InfoBox>
              <span className="body-02 text-gray-500 self-stretch">인증 메일을 받지 못하셨나요?</span>
              <span className="body-04 text-gray-500 self-stretch">7일 이내에 이메일의 인증 링크를 클릭해 주시면 회원가입이 완료됩니다.</span>
              <span className="body-04 text-gray-500 self-stretch">메일을 받지 못했다면 스팸함을 확인해 주세요.</span>
            </InfoBox>
          </div>
          <div className="flex items-center self-stretch gap-[12px]">
            <LargeFillButton label="메일 다시 받기" variant="outline" onClick={handleResend} />
            <LargeFillButton label="확인" onClick={() => setStep('inputCode')} className="flex-1" />
          </div>
        </div>
      )}

      {/* INPUT CODE */}
      {step === 'inputCode' && (
        <div className="flex flex-col items-start self-stretch gap-[40px]">
          <div className="flex flex-col items-center self-stretch">
            {/* MailIcon + 제목/설명 */}
            <div className="flex flex-col items-center self-stretch gap-[20px]">
              <MailIcon />
              {/* 11445 */}
              <div className="flex flex-col items-center justify-center gap-2 self-stretch px-[clamp(16px,10vw,96px)]">
                <span className="heading-05 text-black self-stretch text-center">
                  인증번호를 입력해 주세요.
                </span>
                <span className="self-stretch text-center text-gray-700" style={descStyle}>
                  입력하신 이메일로 인증번호를 보내드렸어요.
                </span>
              </div>
            </div>

            {/* 인증번호 입력 섹션: 위쪽 36px */}
            <div className="flex flex-col items-center self-stretch gap-[12px] mt-[36px]">
              <div className="flex w-full max-w-[296px] items-center justify-between">
                <span className="body-03 text-gray-500">인증번호 6자리</span>
                <span className="title-02 text-red-500">{minutes}:{seconds}</span>
              </div>
              {codeBoxes()}
            </div>

            {/* InfoBox: 위쪽 24px */}
            <div className="self-stretch mt-[24px]">
              <InfoBox>
                <span className="body-02 text-gray-500 self-stretch">인증 메일을 받지 못하셨나요?</span>
                <span className="body-04 text-gray-500 self-stretch">7일 이내에 이메일의 인증 링크를 클릭해 주시면 회원가입이 완료됩니다.</span>
                <span className="body-04 text-gray-500 self-stretch">메일을 받지 못했다면 스팸함을 확인해 주세요.</span>
              </InfoBox>
            </div>
          </div>
          <div className="flex flex-col items-center self-stretch gap-[8px]">
            {resendError && (
              <span className="body-04 text-red-500 self-stretch text-center">{resendError}</span>
            )}
            <div className="flex items-center self-stretch gap-[12px]">
              <LargeFillButton label="인증번호 다시 받기" variant="outline" onClick={handleResend} />
              <LargeFillButton label="인증하기" onClick={handleVerify} disabled={isVerifying || code.join('').length < CODE_LENGTH} className="flex-1 title-05" />
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {step === 'success' && (
        <div className="flex flex-col items-start self-stretch gap-[40px]">
          <div className="flex flex-col items-center self-stretch gap-[40px]">
            <div className="flex flex-col items-center self-stretch gap-[20px]">
              <MailIcon />
              <div className="flex flex-col items-center justify-center gap-2 self-stretch">
                <span className="heading-05 text-black self-stretch text-center px-[clamp(16px,10vw,96px)]">
                  이메일 인증이 완료되었어요.
                </span>
                <div className="flex flex-col items-center self-stretch" style={{ gap: '2px' }}>
                  <span className="self-stretch text-center text-gray-700" style={descStyle}>
                    이메일 인증이 정상적으로 완료되었습니다.
                  </span>
                  <span className="self-stretch text-center text-gray-700" style={descStyle}>
                    {successDescription}
                  </span>
                </div>
              </div>
            </div>
            <InfoBox>
              <span className="body-02 text-gray-500 self-stretch">인증된 이메일로 안내를 받을 수 있어요</span>
              <span className="body-04 text-gray-500 self-stretch">비밀번호 재설정, 문의 답변, 중요 알림이 해당 이메일로 발송됩니다.</span>
            </InfoBox>
          </div>
          <LargeFillButton label={successButtonLabel} onClick={onServiceStart} className="title-05" />
        </div>
      )}

      {/* EXPIRED */}
      {step === 'expired' && (
        <div className="flex flex-col items-start self-stretch gap-[40px]">
          <div className="flex flex-col items-center self-stretch">
            <div className="flex flex-col items-center self-stretch gap-[20px]">
              <MailIcon error />
              <div className="flex flex-col items-center justify-center gap-2 self-stretch px-[clamp(16px,10vw,96px)]">
                <span className="heading-05 text-black self-stretch text-center">
                  인증 시간이 만료되었어요
                </span>
                <span className="self-stretch text-center text-gray-700" style={descStyle}>
                  새 인증번호를 받아 다시 인증해 주세요.
                </span>
              </div>
            </div>

            {/* 만료된 코드 표시: 위쪽 36px */}
            <div className="flex flex-col items-center self-stretch gap-[12px] mt-[36px]">
              <div className="flex w-full max-w-[296px] items-center justify-between">
                <span className="body-03 text-gray-500">인증번호 6자리</span>
                <span className="title-02 text-red-500">00:00</span>
              </div>
              {codeBoxes(true)}
            </div>

            {/* InfoBox: 위쪽 24px */}
            <div className="self-stretch mt-[24px]">
              <InfoBox>
                <span className="body-02 text-gray-500 self-stretch">인증 메일을 받지 못하셨나요?</span>
                <span className="body-04 text-gray-500 self-stretch">7일 이내에 이메일의 인증 링크를 클릭해 주시면 회원가입이 완료됩니다.</span>
                <span className="body-04 text-gray-500 self-stretch">메일을 받지 못했다면 스팸함을 확인해 주세요.</span>
              </InfoBox>
            </div>
          </div>
          <LargeFillButton label="인증 메일 다시 받기" variant="red" onClick={handleResend} />
        </div>
      )}

      {/* LIMIT EXCEEDED */}
      {step === 'limitExceeded' && (
        <div className="flex flex-col items-start self-stretch gap-[40px]">
          <div className="flex flex-col items-center self-stretch gap-[40px]">
            <div className="flex flex-col items-center self-stretch gap-[20px]">
              <MailIcon error />
              <div className="flex flex-col items-center justify-center gap-2 self-stretch">
                <span className="heading-05 text-black self-stretch text-center px-[clamp(16px,10vw,96px)]">
                  인증번호 요청 횟수를 초과했어요.
                </span>
                <span className="self-stretch text-center text-gray-700" style={descStyle}>
                  보안을 위해 인증번호 재전송이 잠시 제한되었어요.
                </span>
              </div>
            </div>
            <InfoBox>
              <span className="body-02 text-gray-500 self-stretch">인증 메일을 받지 못하셨나요?</span>
              <span className="body-04 text-gray-500 self-stretch">3분 후 다시 시도해 주세요.</span>
              <span className="body-04 text-gray-500 self-stretch">문제가 계속되면 <span className="text-gray-700">고객센터 0000-0000</span>로 문의해 주세요.</span>
            </InfoBox>
          </div>
          <div className="flex items-center self-stretch gap-[12px]">
            <LargeFillButton label="닫기" variant="outline" onClick={() => setStep('sent')} />
            <LargeFillButton label="인증 번호 다시 받기" variant="red" onClick={handleResend} className="flex-1" />
          </div>
        </div>
      )}

      {/* FAILED */}
      {step === 'failed' && (
        <div className="flex flex-col items-start self-stretch gap-[40px]">
          <div className="flex flex-col items-center self-stretch gap-[40px]">
            <div className="flex flex-col items-center self-stretch gap-[20px]">
              <MailIcon error />
              <div className="flex flex-col items-center justify-center gap-2 self-stretch">
                <span className="heading-05 text-black self-stretch text-center px-[clamp(16px,10vw,96px)]">
                  이메일 인증에 실패했어요.
                </span>
                <div className="flex flex-col items-center self-stretch" style={{ gap: '2px' }}>
                  <span className="self-stretch text-center text-gray-700" style={descStyle}>
                    인증 시간이 만료되었거나, 인증번호가 올바르지 않아요.
                  </span>
                  <span className="self-stretch text-center text-gray-700" style={descStyle}>
                    인증번호를 다시 확인하거나 새 인증번호를 받아주세요.
                  </span>
                </div>
              </div>
            </div>
            <InfoBox>
              <span className="body-02 text-gray-500 self-stretch">인증번호를 다시 확인해 주세요.</span>
              <span className="body-04 text-gray-500 self-stretch">입력한 인증번호가 이메일로 받은 번호와 일치하는지 확인해 주세요.</span>
              <span className="body-04 text-gray-500 self-stretch">계속 실패할 경우 인증번호를 다시 받아 진행해 주세요.</span>
            </InfoBox>
          </div>
          <LargeFillButton label="인증 번호 다시 받기" variant="red" onClick={handleResend} />
        </div>
      )}

    </div>
  );

  return (
    <div className="flex flex-col bg-gray-50">
      {/* 좌우 여백을 Header와 동일한 구조(xl 이상: 고정 188px / 미만: 32px 거터)로 맞춰, 카드가
          줄어들 때도 카드가 놓일 수 있는 영역의 경계가 헤더 로고·버튼과 항상 일치하게 한다.
          카드 자체는 그 영역 안에서 계속 가운데 정렬된다 */}
      <main className="flex flex-1 justify-center items-center px-8 py-[100px] xl:px-[188px]">
        {card}
      </main>
    </div>
  );
}
