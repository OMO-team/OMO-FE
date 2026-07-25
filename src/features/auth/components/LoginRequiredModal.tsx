type LoginRequiredModalProps = {
  onClose: () => void;
  onLoginClick: () => void;
};

export default function LoginRequiredModal({ onClose, onLoginClick }: LoginRequiredModalProps) {
  return (
    <div className="flex w-[610px] flex-col items-center gap-[42px] rounded-4 bg-white px-[60px] pb-[48px] pt-[60px]">
      <div className="flex w-full flex-col gap-[40px]">
        {/* 아이콘 + 제목 + 설명 */}
        <div className="flex w-full flex-col items-center gap-[40px]">
          <div className="flex w-full flex-col items-center gap-[20px]">
            {/* 프로필 아이콘 */}
            <div className="relative h-[70px] w-[70px] overflow-hidden rounded-full bg-primary-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="51"
                height="65"
                viewBox="0 0 51 65"
                fill="none"
                className="absolute left-[9px] top-[14px]"
              >
                <path
                  d="M25.5 31.875C39.5887 31.875 51 37.5806 51 44.625V51H48V65H3V51H0V44.625C9.39527e-08 37.5806 11.4113 31.875 25.5 31.875ZM25.5 0C28.8815 0 32.1245 1.34329 34.5156 3.73438C36.9067 6.12546 38.25 9.36849 38.25 12.75C38.25 16.1315 36.9067 19.3745 34.5156 21.7656C32.1245 24.1567 28.8815 25.5 25.5 25.5C22.1185 25.5 18.8755 24.1567 16.4844 21.7656C14.0933 19.3745 12.75 16.1315 12.75 12.75C12.75 9.36849 14.0933 6.12546 16.4844 3.73438C18.8755 1.34329 22.1185 1.31658e-08 25.5 0Z"
                  fill="var(--color-primary-500)"
                />
              </svg>
            </div>

            {/* 제목 + 설명 */}
            <div className="flex w-full flex-col items-center gap-[8px]">
              <h2 className="heading-05 w-full text-center">로그인이 필요한 서비스예요</h2>
              <div className="flex w-full flex-col items-center gap-[2px]">
                <p className="body-01 w-full text-center text-gray-700">
                  이 기능을 이용하려면 로그인이 필요해요.
                </p>
                <p className="body-01 w-full text-center text-gray-700">
                  로그인 후 지금 보던 화면에서 계속 이용할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Info 섹션 */}
          <div className="flex w-full flex-col gap-[4px] rounded-[16px] bg-gray-50 px-[40px] py-[32px]">
            <div className="flex w-full flex-col gap-[6px]">
              <p className="body-02 text-gray-500">로그인하고 맞춤 서비스를 이용해 보세요</p>
              <div className="flex w-full flex-col gap-[2px]">
                <p className="body-04 text-gray-500">저장한 정보와 이용 내역을 안전하게 관리하고,</p>
                <p className="body-04 text-gray-500">나에게 맞는 서비스를 이어서 이용할 수 있어요.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="title-02 flex h-[48px] w-[180px] items-center justify-center rounded-[8px] bg-gray-100 text-gray-600"
          >
            나중에 하기
          </button>
          <button
            type="button"
            onClick={onLoginClick}
            className="title-02 flex h-[48px] w-[300px] items-center justify-center rounded-[8px] bg-primary-500 text-white"
          >
            로그인 하기
          </button>
        </div>
      </div>
    </div>
  );
}
