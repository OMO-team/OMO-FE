import Header from '../../../shared/components/Header';
import Footer from '../../../shared/components/Footer';
import LockIcon from '../../../shared/components/LockIcon';

type PasswordChangeSuccessPageProps = {
  onLoginClick?: () => void;
};

const TITLE_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.66px',
  color: '#181A1F',
  textAlign: 'center',
};

const DESC_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.28px',
  color: '#6B7A94',
  textAlign: 'center',
};

const INFO_LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.28px',
  color: '#6B7A94',
};

const INFO_BODY_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '13px',
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.39px',
  color: '#6B7A94',
};

const BTN_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.32px',
};

export default function PasswordChangeSuccessPage({ onLoginClick }: PasswordChangeSuccessPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={false} />
      <main className="flex flex-1 items-start justify-center bg-[#F3F4F6]" style={{ paddingTop: '72px', paddingBottom: '300px' }}>
        <div
          style={{
            display: 'flex',
            width: '610px',
            padding: '60px 60px 48px 60px',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '42px',
            borderRadius: '16px',
            background: '#FFF',
          }}
        >
          {/* 자물쇠 아이콘 (파란 원형 배경 포함) */}
          <div
            style={{
              display: 'flex',
              width: '70px',
              height: '70px',
              padding: '14px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '100px',
              background: '#F1F8FF',
            }}
          >
            <LockIcon />
          </div>

          {/* 타이틀 + 설명 + 안내박스 */}
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            {/* 타이틀 + 설명 */}
            <div className="flex flex-col items-center gap-2">
              <p style={TITLE_STYLE}>비밀번호 변경이 완료되었습니다.</p>
              <p style={DESC_STYLE}>새 비밀번호로 안전하게 변경되었습니다.</p>
            </div>

            {/* 안내 박스 */}
            <div
              style={{
                display: 'flex',
                padding: '32px 40px',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px',
                alignSelf: 'stretch',
                borderRadius: '16px',
                background: '#F3F4F6',
              }}
            >
              <p style={INFO_LABEL_STYLE}>로그인 상태를 선택해 주세요.</p>
              <p style={INFO_BODY_STYLE}>보안을 위해 다시 로그인하는 것을 권장드려요.</p>
              <p style={INFO_BODY_STYLE}>현재 기기에서 계속 이용하려면 로그인 상태를 유지할 수 있습니다.</p>
            </div>
          </div>

          {/* 로그인 하러 가기 버튼 */}
          <button
            type="button"
            onClick={onLoginClick}
            style={{
              ...BTN_STYLE,
              width: '100%',
              padding: '14px 0',
              borderRadius: '12px',
              background: '#0085FF',
              color: '#FFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            로그인 하러 가기
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
