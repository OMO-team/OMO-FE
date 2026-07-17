import Icon from "./Icon";
import ExploreIcon from "./ExploreIcon";
import HomeIcon from "./HomeIcon";
import omoLogo from "../../assets/icons/omo-logo.svg";
import iconSearch from "../../assets/icons/icon-search[24].svg";
import profileImage from "../../assets/icons/profile-image.svg";

interface LoggedInHeaderProps {
  userAvatarUrl?: string;
}

export default function LoggedInHeader({ userAvatarUrl }: LoggedInHeaderProps) {
  return (
    <header className="flex w-full items-center justify-center gap-[216px] bg-white px-[188px] pt-6 pb-6">
      {/* 왼쪽: 로고 + 검색창 */}
      <div className="flex items-center gap-4">
        <Icon size="xl">
          <img src={omoLogo} alt="OMO 로고" />
        </Icon>

        {/* 검색창 */}
        <div className="flex h-10 w-[418px] cursor-pointer items-center gap-8 rounded-2 bg-gray-50 py-2 pl-5 pr-4">
          <span className="body-03 flex-1 text-gray-400">
            도시나 키워드로 검색하기
          </span>
          <Icon size="md">
            <img src={iconSearch} alt="검색" />
          </Icon>
        </div>
      </div>

      {/* 오른쪽: 탐색/내홈 + 프로필 */}
      <div className="flex items-center gap-[20px]">
        <div className="flex items-center gap-2">
          {/* 탐색 버튼 */}
          <button
            type="button"
            className="flex flex-col items-start w-20 py-[10px] pl-[10px] pr-3 gap-1 rounded-2 bg-white border-none cursor-pointer"
          >
            <div className="flex items-center gap-[10px] self-stretch">
              <div className="flex h-5 w-5 items-center justify-center">
                <ExploreIcon color="var(--color-gray-700)" />
              </div>
              <span className="body-02 text-gray-700">탐색</span>
            </div>
          </button>

          {/* 내 홈 버튼 */}
          <button
            type="button"
            className="flex flex-col items-start w-20 py-[10px] pl-[10px] pr-3 gap-1 rounded-2 bg-white border-none cursor-pointer"
          >
            <div className="flex items-center gap-[10px] self-stretch">
              <div className="flex h-5 w-5 items-center justify-center">
                <HomeIcon color="var(--color-gray-700)" />
              </div>
              <span className="body-02 text-gray-700">내 홈</span>
            </div>
          </button>
        </div>

        {/* 프로필 */}
        <button type="button" aria-label="내 계정" className="shrink-0">
          <img
            src={userAvatarUrl || profileImage}
            alt=""
            className="size-10 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
