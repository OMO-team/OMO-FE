import { useLocation, useNavigate } from 'react-router-dom';
import Icon from "./Icon";
import ExploreIcon from "./ExploreIcon";
import HomeIcon from "./HomeIcon";
import profileImage from "../../assets/icons/profile-image.svg";
import omoLogo from "../../assets/icons/omo-logo.svg";
import iconSearch from "../../assets/icons/icon-search[24].svg";
import iconSmartBriefing from "../../assets/icons/icon-smart-briefing.svg";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

type ActiveNav = "explore" | "myhome" | null;

interface HeaderProps {
  /** overlay: 이미지 위 흰색 텍스트. transparent: 배경 투명 + 다크 텍스트(홈). default: 흰 배경 */
  variant?: "default" | "overlay" | "transparent";
  onSmartBriefingClick?: () => void;
}

export default function Header({ variant = "default", onSmartBriefingClick }: HeaderProps) {
  const { isLoggedIn, userAvatarUrl, openModal, openSearch } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isOverlay = variant === "overlay";
  const isTransparent = variant === "transparent";

  const activeNav: ActiveNav =
    pathname === "/city-insight"
      ? "explore"
      : pathname.startsWith("/myhome")
        ? "myhome"
        : null;

  const handleExploreClick = () => {
    if (isLoggedIn) navigate('/city-insight');
    else openModal('loginRequired');
  };

  const handleMyHomeClick = () => {
    if (isLoggedIn) navigate('/myhome/empty');
    else openModal('loginRequired');
  };

  const getNavIconColor = (nav: ActiveNav) =>
    isOverlay
      ? "#FFFFFF"
      : activeNav === nav
        ? "var(--color-primary-500)"
        : "#404959";

  const getNavTextClass = (nav: ActiveNav) => {
    if (activeNav !== nav) return isOverlay ? "text-white" : "text-gray-700";
    return isOverlay
      ? "border border-white/20 bg-white/16 text-white"
      : "border border-[rgba(0,106,204,0.20)] bg-[rgba(0,133,255,0.16)] text-primary-500";
  };

  return (
    <header className={`flex w-full items-center justify-between px-[188px] pt-6 pb-6 ${isOverlay || isTransparent ? "bg-transparent" : "bg-white"}`}>
      {/* 왼쪽: 로고 + 검색창 */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => navigate('/')} className="flex items-center justify-center self-stretch">
          <img
            src={omoLogo}
            alt="OMO 로고"
            style={{ width: '62px', height: '18.888px' }}
            className={isOverlay ? "brightness-0 invert" : ""}
          />
        </button>

        <div
          className="flex h-10 w-[418px] cursor-pointer items-center gap-8 rounded-2 bg-gray-50 py-2 pl-5 pr-4 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)]"
          onClick={openSearch}
        >
          <span className="body-03 flex-1 text-gray-400">
            도시나 키워드로 검색하기
          </span>
          <Icon size="md">
            <img src={iconSearch} alt="검색" />
          </Icon>
        </div>
      </div>

      {/* 오른쪽: Frame 76 — gap-4(16px), 탐색/내홈/스마트브리핑은 gap 없음 */}
      <div className="flex items-center gap-4">
        {/* 탐색 / 내홈 / 스마트 브리핑 — gap 없음 */}
        <div className="flex items-center">
          <button
            onClick={handleExploreClick}
            className={`flex shrink-0 items-center gap-[10px] rounded-2 py-2.5 pl-2.5 pr-3 body-02 whitespace-nowrap hover:shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] transition-shadow ${getNavTextClass("explore")}`}
          >
            <Icon size="sm">
              <ExploreIcon color={getNavIconColor("explore")} />
            </Icon>
            탐색
          </button>

          <button
            onClick={handleMyHomeClick}
            className={`flex shrink-0 items-center gap-[10px] rounded-2 py-2.5 pl-2.5 pr-3 body-02 whitespace-nowrap hover:shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] transition-shadow ${getNavTextClass("myhome")}`}
          >
            <Icon size="sm">
              <HomeIcon color={getNavIconColor("myhome")} />
            </Icon>
            내 홈
          </button>

          <button
            type="button"
            onClick={onSmartBriefingClick}
            className="flex shrink-0 flex-col items-start gap-[2px] rounded-lg py-[10px] pl-[10px] pr-3 hover:shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] transition-shadow"
          >
            <div className="flex items-center gap-[10px] self-stretch">
              <div className="flex h-5 w-5 items-center justify-center">
                <img src={iconSmartBriefing} alt="" style={{ width: '18px', height: '12px' }} />
              </div>
              <span className="body-02 text-gray-700">스마트 브리핑</span>
            </div>
          </button>
        </div>

        {/* 로그인 전/후 */}
        {isLoggedIn ? (
          <button type="button" aria-label="내 계정" className="shrink-0" onClick={() => navigate('/setting')}>
            {userAvatarUrl ? (
              <img src={userAvatarUrl} alt="" className="size-10 rounded-full object-cover" />
            ) : (
              <div className="relative size-10 overflow-hidden rounded-full">
                {/* profile-image.svg는 102x102 캔버스 안에 그림자 여백을 두고 86x86 원이 (8,5)에 그려져 있어
                    object-cover로 자르면 원이 중심에서 벗어나 보임 — 네이티브 비율로 확대해 원을 박스에 꽉 채움 */}
                <img
                  src={profileImage}
                  alt=""
                  className="absolute"
                  style={{ left: "-9.302%", top: "-5.814%", width: "118.605%", height: "118.605%" }}
                />
              </div>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => openModal('login')}
              className={`flex items-center rounded-2 px-[18px] py-2.5 body-03 ${isOverlay ? "text-white" : "text-gray-700"}`}
            >
              로그인
            </button>
            <button
              onClick={() => openModal('signup')}
              className="flex items-center rounded-2 bg-primary-500 px-[18px] py-2.5 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] body-03 text-white"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
