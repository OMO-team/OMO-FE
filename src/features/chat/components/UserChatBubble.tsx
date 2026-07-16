import { useState } from 'react';

type UserChatBubbleProps = {
  text?: string;
  images?: Array<{ id: string; isUploaded: boolean }>;
};

const LONG_TEXT_THRESHOLD = 60;

const IMAGE_STACK_CONFIGS = [
  { left: 0,   zIndex: 1, bg: '#E7EAEF' },
  { left: 70,  zIndex: 2, bg: '#E7EAEF' },
  { left: 140, zIndex: 3, bg: '#E7EAEF' },
] as const;

const textStyle: React.CSSProperties = {
  color: '#15181D',
  textAlign: 'center',
  fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '150%',
  letterSpacing: '-0.28px',
};

function ImageStack({ images }: { images: Array<{ id: string; isUploaded: boolean }> }) {
  return (
    <div style={{ position: 'relative', width: '270px', height: '160px', flexShrink: 0 }}>
      {IMAGE_STACK_CONFIGS.map((cfg, i) => {
        const img = images[i];
        const bg = img?.isUploaded ? '#94A0B4' : cfg.bg;
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
            {/* 이미지 내부 placeholder */}
            <div
              style={{
                width: '130px',
                height: '160px',
                borderRadius: '12px',
                background: img?.isUploaded ? '#94A0B4' : '#CFD3DA',
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
              background: '#E7EAEF',
            }}
          >
            <span style={textStyle}>{text}</span>
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
            background: '#E7EAEF',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              ...textStyle,
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
              background: 'linear-gradient(180deg, rgba(231, 234, 239, 0.00) -21.67%, #E7EAEF 39.15%)',
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
                  style={{
                    color: '#6B7A94',
                    fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    lineHeight: '140%',
                    letterSpacing: '-0.39px',
                  }}
                >
                  더보기
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 6L8 10L3 6" stroke="#6B7A94" strokeLinecap="round" strokeLinejoin="round" />
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
          background: '#E7EAEF',
        }}
      >
        <span style={textStyle}>{text}</span>
      </div>
    </div>
  );
}
