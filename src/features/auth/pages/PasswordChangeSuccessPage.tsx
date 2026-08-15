import Header from '../../../shared/components/Header';
import Footer from '../../../shared/components/Footer';
import PasswordSuccessInfo from '../components/PasswordSuccessInfo';

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
      <Header />
      <main
        className="flex flex-1 items-start justify-center bg-gray-50"
        style={{ paddingTop: '72px', paddingBottom: '300px' }}
      >
        <div
          className="flex flex-col items-center rounded-4 bg-white"
          style={{ width: '610px', padding: '60px 60px 48px 60px', gap: '40px' }}
        >
          <PasswordSuccessInfo />

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
