import Icon from "./Icon";
import ExploreIcon from "./ExploreIcon";
import HomeIcon from "./HomeIcon";
import profileImage from "../../assets/icons/profile-image.svg";
import omoLogo from "../../assets/icons/omo-logo.svg";
import iconSearch from "../../assets/icons/icon-search[24].svg";

type ActiveNav = "explore" | "myhome" | null;

interface HeaderProps {
  isLoggedIn: boolean;
  userAvatarUrl?: string;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export default function Header({ isLoggedIn, userAvatarUrl, onLoginClick, onSignupClick }: HeaderProps) {
  // 임시 라우팅 주소
  const activeNav: ActiveNav =
    location.pathname === "/explore"
      ? "explore"
      : location.pathname === "/myhome"
        ? "myhome"
        : null;

  return (
    <header className="flex w-full items-center justify-center gap-[216px] px-[188px] pt-6">
      {/* 왼쪽: 로고 + 검색창 */}
      <div className="flex items-center gap-4">
        <Icon size="xl">
          <img src={omoLogo} alt="OMO 로고" />
        </Icon>

        <div className="flex h-10 w-[418px] cursor-pointer items-center gap-8 rounded-2 bg-gray-50 py-2 pl-5 pr-4 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)]">
          <span className="body-03 flex-1 text-gray-400">
            도시나 키워드로 검색하기
          </span>
          <Icon size="md">
            <img src={iconSearch} alt="검색" />
          </Icon>
        </div>
      </div>

      {/* 오른쪽: 탐색/내홈 + (로그인 상태에 따라 분기) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            className={`flex w-20 items-center gap-1 rounded-2 py-2.5 pl-2.5 pr-3 body-02 ${
              activeNav === "explore"
                ? "border border-[rgba(0,106,204,0.20)] bg-[rgba(0,133,255,0.16)] text-primary-500"
                : "text-gray-700"
            }`}
          >
            <Icon size="sm">
              <ExploreIcon />
            </Icon>
            탐색
          </button>

          <button
            className={`flex w-20 items-center gap-1 rounded-2 py-2.5 pl-2.5 pr-3 body-02 ${
              activeNav === "myhome"
                ? "border border-[rgba(0,106,204,0.20)] bg-[rgba(0,133,255,0.16)] text-primary-500"
                : "text-gray-700"
            }`}
          >
            <Icon size="sm">
              <HomeIcon />
            </Icon>
            내 홈
          </button>
        </div>

        {isLoggedIn ? (
          <button type="button" aria-label="내 계정" className="shrink-0">
            <img
              src={userAvatarUrl || profileImage}
              alt=""
              className="size-10 rounded-full object-cover"
            />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button onClick={onLoginClick} className="flex items-center rounded-2 px-[18px] py-2.5 body-03 text-gray-700">
              로그인
            </button>
            <button onClick={onSignupClick} className="flex items-center rounded-2 bg-primary-500 px-[18px] py-2.5 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] body-03 text-white">
              회원가입
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
