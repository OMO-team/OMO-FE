import { useState } from 'react';

type UserChatBubbleProps = {
  text?: string;
  images?: Array<{ id: string; isUploaded: boolean }>;
};

const LONG_TEXT_THRESHOLD = 60;

const IMAGE_STACK_CONFIGS = [
  { left: 0,   zIndex: 1, bg: 'var(--color-gray-100)' },
  { left: 70,  zIndex: 2, bg: 'var(--color-gray-100)' },
  { left: 140, zIndex: 3, bg: 'var(--color-gray-100)' },
] as const;

function ImageStack({ images }: { images: Array<{ id: string; isUploaded: boolean }> }) {
  return (
    <div style={{ position: 'relative', width: '270px', height: '160px', flexShrink: 0 }}>
      {IMAGE_STACK_CONFIGS.map((cfg, i) => {
        const img = images[i];
        const bg = img?.isUploaded ? 'var(--color-gray-400)' : cfg.bg;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cfg.left,
              top: 0,
              width: '130px',
              height: '160px',
              borderRadius: '12px',
              background: bg,
              boxShadow: '0 8px 14px 0 rgba(6, 49, 88, 0.20)',
              zIndex: cfg.zIndex,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '130px',
                height: '160px',
                borderRadius: '12px',
                background: img?.isUploaded ? 'var(--color-gray-400)' : 'var(--color-gray-200)',
                boxShadow: '0 8px 14px 0 rgba(6, 49, 88, 0.20)',
              }}
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
      <div style={{ display: 'flex', width: '370px', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
        <div style={{ display: 'flex', width: '370px', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <ImageStack images={images} />
        </div>
      </div>
    );
  }

  // 이미지 + 텍스트
  if (hasImages && text) {
    return (
      <div style={{ display: 'flex', width: '370px', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
        <div style={{ display: 'flex', width: '370px', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <ImageStack images={images} />
          <div
            style={{
              display: 'inline-flex',
              width: '370px',
              padding: '10px 20px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '200px',
              background: 'var(--color-gray-100)',
            }}
          >
            <span
              className="body-03"
              style={{ color: 'var(--color-gray-900)', textAlign: 'center' }}
            >
              {text}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 텍스트 많을 때
  if (isLong) {
    return (
      <div style={{ display: 'flex', width: '370px', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: '370px',
            height: '180px',
            padding: '16px 20px',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            borderRadius: '16px',
            background: 'var(--color-gray-100)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <span
            className="body-03"
            style={{
              color: 'var(--color-gray-900)',
              textAlign: 'left',
              width: '330px',
              height: '148px',
              overflow: 'hidden',
              display: 'block',
              flexShrink: 0,
            }}
          >
            {text}
          </span>

          {/* Frame 11260: 그라데이션 + 더보기 버튼 오버레이 */}
          <div
            style={{
              position: 'absolute',
              bottom: '1px',
              left: 0,
              width: '370px',
              paddingTop: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '0 0 16px 16px',
              background: 'linear-gradient(180deg, rgba(231, 234, 239, 0.00) -21.67%, var(--color-gray-100) 39.15%)',
            }}
          >
            {/* Frame 11261 */}
            <div
              style={{
                display: 'flex',
                width: '370px',
                padding: '6px 0 8px 20px',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
              }}
            >
              {/* Frame 11262 */}
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span
                  className="body-04"
                  style={{ color: 'var(--color-gray-500)' }}
                >
                  더보기
                </span>
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
    <div style={{ display: 'flex', width: '370px', flexDirection: 'column', alignItems: 'flex-end' }}>
      <div
        style={{
          display: 'inline-flex',
          padding: '10px 20px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          borderRadius: isExpanded ? '16px' : '200px',
          background: 'var(--color-gray-100)',
        }}
      >
        <span
          className="body-03"
          style={{ color: 'var(--color-gray-900)', textAlign: 'center' }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
