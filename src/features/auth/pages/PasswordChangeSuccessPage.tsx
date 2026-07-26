import Header from '../../../shared/components/Header';
import Footer from '../../../shared/components/Footer';
import LockIcon from '../../../shared/components/LockIcon';

type PasswordChangeSuccessPageProps = {
  onKeepLoggedIn?: () => void;
  onLoginAgain?: () => void;
};

export default function PasswordChangeSuccessPage({
  onKeepLoggedIn,
  onLoginAgain,
}: PasswordChangeSuccessPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn />
      <main
        className="flex flex-1 items-start justify-center bg-gray-50"
        style={{ paddingTop: '72px', paddingBottom: '300px' }}
      >
        <div
          className="flex flex-col items-center rounded-4 bg-white"
          style={{ width: '610px', padding: '60px 60px 48px 60px', gap: '40px' }}
        >
          {/* 아이콘 + 타이틀 + 설명 + 안내박스 */}
          <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
            <div className="flex flex-col items-center" style={{ gap: '20px' }}>
              {/* 자물쇠 아이콘 */}
              <div
                className="flex flex-col justify-center items-center rounded-full bg-[#F1F8FF]"
                style={{ width: '70px', height: '70px', padding: '14px', gap: '4px' }}
              >
                <LockIcon />
              </div>

              <div className="flex flex-col items-center gap-1">
                <p className="heading-05 text-gray-900 text-center">비밀번호 변경이 완료되었습니다.</p>
                <p className="text-[16px] font-normal text-gray-700 text-center">
                  새 비밀번호로 안전하게 변경되었습니다.
                </p>
              </div>
            </div>

            {/* 안내 박스 */}
            <div
              className="flex flex-col items-start rounded-4 bg-gray-50 self-stretch"
              style={{ padding: '32px 40px', gap: '6px' }}
            >
              <p className="body-02 text-gray-500">로그인 상태를 선택해 주세요.</p>
              <div className="flex flex-col gap-0.5">
                <p className="body-04 text-gray-500">보안을 위해 다시 로그인하는 것을 권장드려요.</p>
                <p className="body-04 text-gray-500">현재 기기에서 계속 이용하려면 로그인 상태를 유지할 수 있습니다.</p>
              </div>
            </div>
          </div>

          {/* 로그인 유지하기 / 다시 로그인하기 버튼 */}
          <div className="flex items-start gap-2.5 self-stretch">
            <button
              type="button"
              onClick={onKeepLoggedIn}
              className="w-[180px] shrink-0 rounded-2 bg-gray-100 text-gray-600 border-none cursor-pointer title-02"
              style={{ padding: '12px 18px' }}
            >
              로그인 유지하기
            </button>
            <button
              type="button"
              onClick={onLoginAgain}
              className="flex-1 rounded-2 bg-primary-500 text-white border-none cursor-pointer title-02"
              style={{ padding: '12px 18px' }}
            >
              다시 로그인하기
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
