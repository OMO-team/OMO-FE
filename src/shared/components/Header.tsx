import { useLocation, useNavigate } from 'react-router-dom';
import Icon from "./Icon";
import ExploreIcon from "./ExploreIcon";
import HomeIcon from "./HomeIcon";
import profileImage from "../../assets/icons/profile-image.svg";
import omoLogo from "../../assets/icons/omo-logo.svg";
import iconSearch from "../../assets/icons/icon-search[24].svg";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

type ActiveNav = "explore" | "myhome" | null;

interface HeaderProps {
  /** overlay: 이미지 위 흰색 텍스트. transparent: 배경 투명 + 다크 텍스트(홈). default: 흰 배경 */
  variant?: "default" | "overlay" | "transparent";
}

export default function Header({ variant = "default" }: HeaderProps) {
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
    navigate('/city-insight');
  };

  const handleMyHomeClick = () => {
    if (isLoggedIn) navigate('/myhome/empty');
    else openModal('loginRequired');
  };

  const getNavIconColor = (nav: ActiveNav) =>
    isOverlay
      ? "#FFFFFF"
      : activeNav === nav
        ? "var(--color-primary-600)"
        : "#404959";

  const getNavTextClass = (nav: ActiveNav) => {
    if (activeNav !== nav) return isOverlay ? "text-white" : "text-gray-700";
    return isOverlay
      ? "border border-white/20 bg-white/16 text-white"
      : "border border-[rgba(0,106,204,0.20)] bg-[rgba(0,133,255,0.16)] text-primary-600";
  };

  const accountButton = (
    <button type="button" aria-label="내 계정" className="shrink-0" onClick={() => navigate('/setting')}>
      {userAvatarUrl ? (
        <img src={userAvatarUrl} alt="" className="size-10 rounded-full object-cover" />
      ) : (
        <div className="relative size-10 overflow-hidden rounded-full bg-gray-100">
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
  );

  return (
    <>
      {/* xl(1280px) 이상: dev(프로덕션) 원본과 완전히 동일한 고정 레이아웃 */}
      <header className={`sticky top-0 z-30 hidden w-full items-center justify-between px-[188px] pt-6 pb-6 xl:flex ${isOverlay || isTransparent ? "bg-transparent" : "bg-white"}`}>
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

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <button
              onClick={handleExploreClick}
              className={`flex w-[80px] shrink-0 items-center gap-[10px] rounded-2 py-2.5 pl-2.5 pr-3 body-02 whitespace-nowrap hover:shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] transition-shadow ${getNavTextClass("explore")}`}
            >
              <Icon size="sm">
                <ExploreIcon color={getNavIconColor("explore")} />
              </Icon>
              탐색
            </button>

            <button
              onClick={handleMyHomeClick}
              className={`flex w-[80px] shrink-0 items-center gap-[10px] rounded-2 py-2.5 pl-2.5 pr-3 body-02 whitespace-nowrap hover:shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] transition-shadow ${getNavTextClass("myhome")}`}
            >
              <Icon size="sm">
                <HomeIcon color={getNavIconColor("myhome")} />
              </Icon>
              내 홈
            </button>
          </div>

          {isLoggedIn ? (
            accountButton
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => openModal('login')}
                className={`flex shrink-0 items-center rounded-2 px-[18px] py-2.5 body-03 whitespace-nowrap ${isOverlay ? "text-white" : "text-gray-700"}`}
              >
                로그인
              </button>
              <button
                onClick={() => openModal('signup')}
                className="flex shrink-0 items-center rounded-2 bg-primary-500 px-[18px] py-2.5 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] body-03 text-white whitespace-nowrap"
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </header>

      {/* xl(1280px) 미만: 반응형 — 창이 줄어들면 좌우 여백이 먼저 줄고,
          여백이 다 줄어들어 왼쪽/오른쪽이 만나면 그 다음부터 검색창이 줄어듦 */}
      <header className={`sticky top-0 z-30 flex w-full px-4 py-6 xl:hidden ${isOverlay || isTransparent ? "bg-transparent" : "bg-white"}`}>
        <div className="@container mx-auto flex w-full max-w-[888px] items-center gap-3 @[850px]:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 @[850px]:gap-4">
            <button type="button" onClick={() => navigate('/')} className="flex shrink-0 items-center justify-center self-stretch">
              <img
                src={omoLogo}
                alt="OMO 로고"
                style={{ width: '62px', height: '18.888px' }}
                className={isOverlay ? "brightness-0 invert" : ""}
              />
            </button>

            <div
              className="flex h-10 min-w-0 flex-1 max-w-[418px] cursor-pointer items-center justify-end gap-2 rounded-2 bg-gray-50 px-3 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)]"
              onClick={openSearch}
            >
              <span className="body-03 min-w-0 flex-1 truncate text-gray-400">
                도시나 키워드로 검색하기
              </span>
              <span className="shrink-0">
                <Icon size="md">
                  <img src={iconSearch} alt="검색" />
                </Icon>
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 @[850px]:gap-4">
            <div className="flex items-center">
              <button
                onClick={handleExploreClick}
                className={`flex shrink-0 items-center gap-[10px] rounded-2 py-2.5 pl-2.5 pr-2.5 @[850px]:pr-3 body-02 whitespace-nowrap hover:shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] transition-shadow ${getNavTextClass("explore")}`}
              >
                <Icon size="sm">
                  <ExploreIcon color={getNavIconColor("explore")} />
                </Icon>
                <span className="hidden @[850px]:inline">탐색</span>
              </button>

              <button
                onClick={handleMyHomeClick}
                className={`flex shrink-0 items-center gap-[10px] rounded-2 py-2.5 pl-2.5 pr-2.5 @[850px]:pr-3 body-02 whitespace-nowrap hover:shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] transition-shadow ${getNavTextClass("myhome")}`}
              >
                <Icon size="sm">
                  <HomeIcon color={getNavIconColor("myhome")} />
                </Icon>
                <span className="hidden @[850px]:inline">내 홈</span>
              </button>
            </div>

            {isLoggedIn ? (
              accountButton
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openModal('login')}
                  className={`flex shrink-0 items-center rounded-2 px-2.5 @[850px]:px-[18px] py-2.5 body-03 whitespace-nowrap ${isOverlay ? "text-white" : "text-gray-700"}`}
                >
                  로그인
                </button>
                <button
                  onClick={() => openModal('signup')}
                  className="flex shrink-0 items-center rounded-2 bg-primary-500 px-2.5 @[850px]:px-[18px] py-2.5 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] body-03 text-white whitespace-nowrap"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
