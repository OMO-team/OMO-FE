import LockIcon from '../../../shared/components/LockIcon';

/** 비밀번호 변경/재설정 완료 화면에서 공통으로 쓰는 아이콘 + 타이틀 + 안내 문구.
 *  로그인 상태인 "비밀번호 변경"(PasswordChangeSuccessPage)과 로그아웃 상태인
 *  "비밀번호 찾기" 재설정(PasswordResetSuccessPage) 둘 다 이 내용은 동일하고,
 *  하단 버튼 영역만 다르다 */
export default function PasswordSuccessInfo() {
  return (
    <div className="flex flex-col items-center self-stretch" style={{ gap: '40px' }}>
      <div className="flex flex-col items-center" style={{ gap: '20px' }}>
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
  );
}
