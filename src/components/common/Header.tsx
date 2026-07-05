import Icon from './Icon';
import omoLogo from '../../assets/icons/omo-logo.svg';
import searchIcon from '../../assets/icons/icon-search[24].svg';
import exploreIcon from '../../assets/icons/icon-explore.svg';
import homeIcon from '../../assets/icons/icon-home.svg';
import profileIcon from '../../assets/icons/icon-profile.svg';

type HeaderProps = {
  showProfile?: boolean;
};

const Header = ({ showProfile = false }: HeaderProps) => {
  return (
    <header className="flex justify-center items-center w-full px-[188px] pt-6 gap-[216px] bg-white">
      {/* 왼쪽: 로고 + 검색창 */}
      <div className="flex items-center gap-4">
        {/* 로고 */}
        <Icon size="xl">
          <img src={omoLogo} alt="OMO 로고" />
        </Icon>

        {/* 검색창 */}
        <div className="flex items-center w-[418px] h-[40px] pl-5 pr-4 py-2 gap-8 rounded-2 bg-gray-50 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] cursor-pointer">
          <span className="body-03 text-gray-400 flex-1">도시나 키워드로 검색하기</span>
          <Icon size="md">
            <img src={searchIcon} alt="검색" />
          </Icon>
        </div>
      </div>

      {/* 오른쪽 */}
      <div className="flex items-center gap-2">

        {/* 탐색 + 내홈 묶음 */}
        <div className="flex items-center gap-2">
          <button className="flex items-center w-[80px] pl-[10px] pr-[12px] py-[10px] gap-[4px] rounded-2 border border-[rgba(0,106,204,0.20)] bg-[rgba(0,133,255,0.16)] body-02 text-primary-500">
            <Icon size="sm">
              <img src={exploreIcon} alt="탐색" />
            </Icon>
            탐색
          </button>
          <button className="flex items-center w-[80px] pl-[10px] pr-[12px] py-[10px] gap-[4px] rounded-2 body-02 text-gray-700">
            <Icon size="sm">
              <img src={homeIcon} alt="내홈" />
            </Icon>
            내 홈
          </button>
        </div>

        {showProfile ? (
          /* 프로필 아이콘 */
          <button className="flex justify-center items-center" style={{ width: '30px', height: '38px' }}>
            <img src={profileIcon} alt="프로필" style={{ width: '30px', height: '30px' }} />
          </button>
        ) : (
          /* 로그인 + 회원가입 묶음 */
          <div className="flex items-center gap-1">
            <button className="flex items-center px-[18px] py-[10px] rounded-2 body-03 text-gray-700">
              로그인
            </button>
            <button className="flex items-center px-[18px] py-[10px] rounded-2 bg-primary-500 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)] body-03 text-white">
              회원가입
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;