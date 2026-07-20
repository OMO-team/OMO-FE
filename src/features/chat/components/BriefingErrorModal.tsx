import ModalOverlay from '../../../shared/components/ModalOverlay';

type BriefingErrorModalProps = {
  onClose: () => void;
  onRetry: () => void;
  onContact?: () => void;
};

function ErrorFileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
      <path d="M22.75 4.375V8.75C22.75 12.8748 22.75 14.938 24.031 16.219C25.312 17.5 27.3752 17.5 31.5 17.5H38.5" stroke="#FF2A14" strokeWidth="2.625"/>
      <path d="M10.5 31.5L15.75 26.25M15.75 31.5L10.5 26.25" stroke="#FF2A14" strokeWidth="2.625" strokeLinecap="round"/>
      <path d="M4.8125 17.5001C4.8125 17.152 4.67422 16.8182 4.42808 16.572C4.18194 16.3259 3.8481 16.1876 3.5 16.1876C3.15191 16.1876 2.81807 16.3259 2.57192 16.572C2.32578 16.8182 2.1875 17.152 2.1875 17.5001H4.8125ZM37.1875 24.5001C37.1875 24.8482 37.3258 25.182 37.5719 25.4282C37.8181 25.6743 38.1519 25.8126 38.5 25.8126C38.8481 25.8126 39.1819 25.6743 39.4281 25.4282C39.6742 25.182 39.8125 24.8482 39.8125 24.5001H37.1875ZM2.37125 10.3723C2.33737 10.7188 2.44251 11.0646 2.66355 11.3335C2.88458 11.6025 3.20341 11.7726 3.54988 11.8065C3.89635 11.8404 4.24209 11.7352 4.51104 11.5142C4.77999 11.2931 4.95012 10.9743 4.984 10.6278L2.37125 10.3723ZM39.6288 31.6278C39.6455 31.4563 39.6284 31.2831 39.5782 31.1182C39.528 30.9533 39.4459 30.7999 39.3365 30.6667C39.227 30.5335 39.0924 30.4232 38.9403 30.3421C38.7883 30.2609 38.6217 30.2105 38.4501 30.1937C38.2786 30.1769 38.1054 30.1941 37.9405 30.2443C37.7756 30.2944 37.6221 30.3766 37.489 30.486C37.22 30.7071 37.0499 31.0259 37.016 31.3723L39.6288 31.6278ZM24.5 37.1876H17.5V39.8126H24.5V37.1876ZM4.8125 24.5001V17.5001H2.1875V24.5001H4.8125ZM37.1875 23.7353V24.5001H39.8125V23.7353H37.1875ZM26.0593 8.06935L32.9875 14.3046L34.7428 12.3516L27.8163 6.11635L26.0593 8.06935ZM39.8125 23.7353C39.8125 20.7796 39.8388 18.9071 39.095 17.2341L36.6958 18.3033C37.1613 19.3498 37.1875 20.5486 37.1875 23.7353H39.8125ZM32.9875 14.3046C35.3553 16.4361 36.2303 17.2586 36.6958 18.3033L39.095 17.2341C38.3495 15.5593 36.9408 14.3291 34.7428 12.3516L32.9875 14.3046ZM17.5525 4.8126C20.321 4.8126 21.3658 4.8336 22.295 5.1906L23.2365 2.7406C21.7455 2.1666 20.1215 2.1876 17.5525 2.1876V4.8126ZM27.8163 6.1181C25.9158 4.40835 24.7275 3.3111 23.2365 2.7406L22.2968 5.1906C23.2278 5.5476 24.0118 6.2266 26.0593 8.06935L27.8163 6.1181ZM17.5 37.1876C14.1628 37.1876 11.7933 37.1841 9.9925 36.9426C8.23375 36.7063 7.21875 36.2618 6.4785 35.5216L4.6235 37.3766C5.9325 38.6891 7.59325 39.2683 9.64425 39.5448C11.6568 39.8161 14.238 39.8126 17.5 39.8126V37.1876ZM2.1875 24.5001C2.1875 27.7621 2.184 30.3416 2.45525 32.3558C2.73175 34.4068 3.31275 36.0676 4.62175 37.3783L6.47675 35.5233C5.73825 34.7813 5.29375 33.7663 5.0575 32.0058C4.816 30.2086 4.8125 27.8373 4.8125 24.5001H2.1875ZM24.5 39.8126C27.762 39.8126 30.3415 39.8161 32.3558 39.5448C34.4068 39.2683 36.0675 38.6873 37.3783 37.3783L35.5233 35.5233C34.7813 36.2618 33.7663 36.7063 32.0058 36.9426C30.2085 37.1841 27.8373 37.1876 24.5 37.1876V39.8126ZM17.5525 2.1876C14.2713 2.1876 11.6795 2.1841 9.65825 2.45535C7.5985 2.73185 5.9325 3.31285 4.62175 4.62185L6.47675 6.47685C7.21875 5.73835 8.2355 5.29385 10.0065 5.0576C11.8143 4.8161 14.1978 4.8126 17.5525 4.8126V2.1876ZM4.984 10.6278C5.19575 8.46835 5.6525 7.30285 6.4785 6.4786L4.6235 4.6236C3.1605 6.0831 2.60575 7.98185 2.37125 10.3723L4.984 10.6278ZM37.016 31.3723C36.8043 33.5318 36.3458 34.6973 35.5215 35.5216L37.3765 37.3766C38.8395 35.9171 39.3943 34.0183 39.6288 31.6278L37.016 31.3723Z" fill="#FF2A14"/>
    </svg>
  );
}

export default function BriefingErrorModal({ onClose, onRetry, onContact }: BriefingErrorModalProps) {
  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="inline-flex flex-col items-center rounded-4 bg-white"
        style={{ padding: '60px 48px 50px 48px', gap: '42px' }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Frame 10914 */}
        <div className="flex flex-col items-center" style={{ width: '494px', gap: '30px' }}>

          {/* Frame 10913: 콘텐츠 영역 */}
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>

            {/* Frame 10912: 아이콘 + 타이틀/설명 */}
            <div className="flex flex-col items-center" style={{ gap: '20px' }}>

              {/* 에러 아이콘 */}
              <div
                className="flex flex-col justify-center items-center rounded-full bg-red-50 flex-shrink-0"
                style={{ width: '70px', height: '70px', padding: '14px', gap: '4px' }}
              >
                <ErrorFileIcon />
              </div>

              {/* Frame 10909: 타이틀 + 설명 */}
              <div className="flex flex-col items-center" style={{ width: '344px', gap: '8px' }}>

                {/* 타이틀 */}
                <p className="heading-05 text-gray-900 text-center">
                  브리핑 생성에 실패했어요.
                </p>

                {/* 설명 */}
                <p
                  className="self-stretch text-center text-gray-700"
                  style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}
                >
                  잠시 후 다시 시도해 주세요.
                </p>
              </div>
            </div>

            {/* Info_Description */}
            <div
              className="flex flex-col items-start self-stretch rounded-4 bg-gray-50"
              style={{ padding: '32px 40px', gap: '4px' }}
            >
              <span className="body-02 text-gray-500 self-stretch">계속 실패하나요?</span>
              <div className="flex flex-col items-start self-stretch" style={{ gap: '2px' }}>
                <span className="body-04 text-gray-500 self-stretch">
                  네트워크 연결 상태를 확인한 뒤 다시 시도해 주세요.
                </span>
                <span className="body-04 text-gray-500 self-stretch">
                  문제가 반복되면{' '}
                  <button
                    type="button"
                    onClick={onContact}
                    className="body-04 text-gray-500 underline"
                  >
                    문의하기
                  </button>
                  를 통해 알려주세요.
                </span>
              </div>
            </div>
          </div>

          {/* Frame 11379: 버튼 영역 */}
          <div className="flex justify-center items-start self-stretch" style={{ gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="flex justify-center items-center rounded-2 bg-gray-100"
              style={{ width: '158px', height: '46px', padding: '12px 18px', gap: '4px' }}
            >
              <span
                className="text-gray-600 text-center"
                style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
              >
                닫기
              </span>
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="flex justify-center items-center rounded-2 bg-[#FF2A14]"
              style={{ width: '326px', height: '46px', padding: '12px 96px', gap: '4px' }}
            >
              <span
                className="text-white text-center"
                style={{ fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.32px' }}
              >
                다시 시도하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
