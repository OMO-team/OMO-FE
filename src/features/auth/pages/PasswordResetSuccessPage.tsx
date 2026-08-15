import PasswordSuccessInfo from '../components/PasswordSuccessInfo';

type PasswordResetSuccessPageProps = {
  onLoginClick?: () => void;
};

/** 비밀번호 찾기(로그아웃 상태)에서 새 비밀번호 재설정을 마쳤을 때 뜨는 전체 화면 —
 *  로그인 상태를 고를 필요가 없어(애초에 로그아웃 상태) 버튼이 "로그인 하러 가기" 하나뿐이다.
 *  로그인 상태에서의 비밀번호 변경(PasswordChangeSuccessPage, 버튼 2개)과는 다른 화면.
 *  Figma: https://www.figma.com/design/08Oa7cqTpAHFFttd1w0yjO/-UMC-10th--OMO?node-id=3940-137640 */
export default function PasswordResetSuccessPage({ onLoginClick }: PasswordResetSuccessPageProps) {
  return (
    <div className="flex flex-col bg-gray-50">
      <main className="flex flex-1 justify-center items-center px-8 py-[100px] xl:px-[188px]">
        <div
          className="flex flex-col items-center rounded-4 bg-white"
          style={{ width: '610px', padding: '60px 60px 48px 60px', gap: '40px' }}
        >
          <PasswordSuccessInfo />

          <button
            type="button"
            onClick={onLoginClick}
            className="flex justify-center items-center self-stretch rounded-2 bg-primary-500 title-02 text-white border-none cursor-pointer"
            style={{ padding: '13px 0' }}
          >
            로그인 하러 가기
          </button>
        </div>
      </main>
    </div>
  );
}
