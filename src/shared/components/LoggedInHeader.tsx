import Icon from "./Icon";
import omoLogo from "../../assets/icons/omo-logo.svg";
import iconSearch from "../../assets/icons/icon-search[24].svg";
import iconExplore from "../../assets/icons/icon-explore.svg";
import iconHome from "../../assets/icons/icon-home.svg";
import profileImage from "../../assets/icons/profile-image.svg";

type ActiveNav = "explore" | "myhome" | null;

interface LoggedInHeaderProps {
  userAvatarUrl?: string;
}

const NAV_BTN_BASE =
  'flex w-20 flex-col items-start gap-1 rounded-[8px] py-[10px] pl-[10px] pr-3 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)]';

const NAV_BTN_ACTIVE =
  'border border-[rgba(0,106,204,0.20)] bg-[rgba(0,133,255,0.16)] text-primary-500';

const NAV_BTN_DEFAULT = 'text-[#404959]';

const NAV_TEXT_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.28px',
  color: '#404959',
};

export default function LoggedInHeader({ userAvatarUrl }: LoggedInHeaderProps) {
  const activeNav: ActiveNav =
    location.pathname === '/explore'
      ? 'explore'
      : location.pathname === '/myhome'
        ? 'myhome'
        : null;

  return (
    <header className="flex w-full items-center justify-center gap-[216px] px-[188px] pt-6">
      {/* 왼쪽: 로고 + 검색창 */}
      <div className="flex items-center gap-4">
        <Icon size="xl">
          <img src={omoLogo} alt="OMO 로고" />
        </Icon>

        {/* 검색창 — L_Header는 그림자 없음 */}
        <div className="flex h-10 w-[418px] cursor-pointer items-center gap-8 rounded-[8px] bg-[#F3F4F6] py-2 pl-5 pr-4">
          <span className="body-03 flex-1 text-gray-400">
            도시나 키워드로 검색하기
          </span>
          <Icon size="md">
            <img src={iconSearch} alt="검색" />
          </Icon>
        </div>
      </div>

      {/* 오른쪽: 탐색/내홈 + 프로필 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {/* 탐색 버튼 */}
          <button
            className={`${NAV_BTN_BASE} ${activeNav === 'explore' ? NAV_BTN_ACTIVE : NAV_BTN_DEFAULT}`}
          >
            <div className="flex items-center gap-[10px] self-stretch">
              <div className="flex h-5 w-5 items-center justify-center">
                <img src={iconExplore} alt="" width={17} height={17} />
              </div>
              <span style={NAV_TEXT_STYLE}>탐색</span>
            </div>
          </button>

          {/* 내 홈 버튼 */}
          <button
            className={`${NAV_BTN_BASE} ${activeNav === 'myhome' ? NAV_BTN_ACTIVE : NAV_BTN_DEFAULT}`}
          >
            <div className="flex items-center gap-[10px] self-stretch">
              <div className="flex h-5 w-5 items-center justify-center">
                <img src={iconHome} alt="" width={17} height={17} />
              </div>
              <span style={NAV_TEXT_STYLE}>내 홈</span>
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
