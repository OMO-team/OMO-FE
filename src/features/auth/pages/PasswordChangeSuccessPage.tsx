import LoggedInHeader from '../../../shared/components/LoggedInHeader';
import Footer from '../../../shared/components/Footer';
import LockIcon from '../../../shared/components/LockIcon';

type PasswordChangeSuccessPageProps = {
  onLoginClick?: () => void;
};

export default function PasswordChangeSuccessPage({ onLoginClick }: PasswordChangeSuccessPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <LoggedInHeader />
      <main
        className="flex flex-1 items-start justify-center bg-gray-50"
        style={{ paddingTop: '72px', paddingBottom: '300px' }}
      >
        <div
          className="flex flex-col items-center rounded-4 bg-white"
          style={{ width: '610px', padding: '60px 60px 48px 60px', gap: '42px' }}
        >
          {/* 자물쇠 아이콘 */}
          <div
            className="flex flex-col justify-center items-center rounded-full bg-primary-50"
            style={{ width: '70px', height: '70px', padding: '14px', gap: '4px' }}
          >
            <LockIcon />
          </div>

          {/* 타이틀 + 설명 + 안내박스 */}
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            <div className="flex flex-col items-center gap-[4px] self-stretch">
              <p className="heading-05 min-h-[32px] self-stretch text-center text-black">비밀번호 변경이 완료되었습니다.</p>
              <p className="body-01 self-stretch text-center text-gray-700">새 비밀번호로 안전하게 변경되었습니다.</p>
            </div>

            {/* 안내 박스 */}
            <div
              className="flex flex-col items-start rounded-4 bg-gray-50 self-stretch"
              style={{ padding: '32px 40px', gap: '4px' }}
            >
              <p className="body-02 text-gray-500">로그인 상태를 선택해 주세요.</p>
              <p className="body-04 text-gray-500">보안을 위해 다시 로그인하는 것을 권장드려요.</p>
              <p className="body-04 text-gray-500">현재 기기에서 계속 이용하려면 로그인 상태를 유지할 수 있습니다.</p>
            </div>
          </div>

          {/* 로그인 하러 가기 버튼 */}
          <button
            type="button"
            onClick={onLoginClick}
            className="flex w-[490px] items-center justify-center gap-[4px] rounded-2 bg-primary-500 py-[13px] title-05 text-white"
          >
            로그인 하러 가기
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
