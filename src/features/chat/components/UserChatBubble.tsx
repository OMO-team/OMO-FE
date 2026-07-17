import { useState } from 'react';

type UserChatBubbleProps = {
  text?: string;
  images?: Array<{ id: string; isUploaded: boolean }>;
};

const LONG_TEXT_THRESHOLD = 60;

const IMAGE_STACK_CONFIGS = [
  { left: 0,   zIndex: 1 },
  { left: 70,  zIndex: 2 },
  { left: 140, zIndex: 3 },
] as const;

function ImageStack({ images }: { images: Array<{ id: string; isUploaded: boolean }> }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: '270px', height: '160px' }}>
      {IMAGE_STACK_CONFIGS.map((cfg, i) => {
        const img = images[i];
        return (
          <div
            key={i}
            className={`absolute rounded-3 overflow-hidden ${img?.isUploaded ? 'bg-gray-400' : 'bg-gray-100'}`}
            style={{
              left: cfg.left,
              top: 0,
              width: '130px',
              height: '160px',
              boxShadow: '0 8px 14px 0 rgba(6, 49, 88, 0.20)',
              zIndex: cfg.zIndex,
            }}
          >
            <div
              className={`rounded-3 ${img?.isUploaded ? 'bg-gray-400' : 'bg-gray-200'}`}
              style={{ width: '130px', height: '160px', boxShadow: '0 8px 14px 0 rgba(6, 49, 88, 0.20)' }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function UserChatBubble({ text = '', images }: UserChatBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasImages = images && images.length > 0;
  const isLong = !hasImages && text.length > LONG_TEXT_THRESHOLD && !isExpanded;

  // 이미지만
  if (hasImages && !text) {
    return (
      <div className="flex flex-col items-end gap-4" style={{ width: '370px' }}>
        <div className="flex flex-col items-end gap-3" style={{ width: '370px' }}>
          <ImageStack images={images} />
        </div>
      </div>
    );
  }

  // 이미지 + 텍스트
  if (hasImages && text) {
    return (
      <div className="flex flex-col items-end gap-4" style={{ width: '370px' }}>
        <div className="flex flex-col items-end gap-3" style={{ width: '370px' }}>
          <ImageStack images={images} />
          <div
            className="inline-flex items-center justify-center gap-1 rounded-full bg-gray-100"
            style={{ width: '370px', padding: '10px 20px' }}
          >
            <span className="body-03 text-gray-900 text-center">{text}</span>
          </div>
        </div>
      </div>
    );
  }

  // 텍스트 많을 때
  if (isLong) {
    return (
      <div className="flex flex-col items-end" style={{ width: '370px' }}>
        <div
          className="relative flex flex-col items-start justify-start rounded-4 bg-gray-100 overflow-hidden"
          style={{ width: '370px', height: '180px', padding: '16px 20px', boxSizing: 'border-box' }}
        >
          <span
            className="body-03 text-gray-900 text-left block flex-shrink-0 overflow-hidden"
            style={{ width: '330px', height: '148px' }}
          >
            {text}
          </span>

          {/* 그라데이션 + 더보기 버튼 오버레이 */}
          <div
            className="absolute left-0 flex items-center justify-center"
            style={{
              bottom: '1px',
              width: '370px',
              paddingTop: '18px',
              borderRadius: '0 0 16px 16px',
              background: 'linear-gradient(180deg, rgba(231, 234, 239, 0.00) -21.67%, var(--color-gray-100) 39.15%)',
            }}
          >
            <div
              className="flex items-center gap-1 flex-shrink-0"
              style={{ width: '370px', padding: '6px 0 8px 20px' }}
            >
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-0.5 bg-transparent border-none cursor-pointer p-0"
              >
                <span className="body-04 text-gray-500">더보기</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 6L8 10L3 6" stroke="var(--color-gray-500)" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 한 줄 (기본) / 펼쳐진 상태
  return (
    <div className="flex flex-col items-end" style={{ width: '370px' }}>
      <div
        className={`inline-flex items-center justify-center gap-1 bg-gray-100 ${isExpanded ? 'rounded-4' : 'rounded-full'}`}
        style={{ padding: '10px 20px' }}
      >
        <span className="body-03 text-gray-900 text-center">{text}</span>
      </div>
    </div>
  );
}
