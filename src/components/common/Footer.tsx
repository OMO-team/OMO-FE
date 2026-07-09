import snsInstagram from '../../assets/icons/sns-instagram.png';
import snsYoutube from '../../assets/icons/sns-youtube.png';
import OmoLogoIcon from './OmoLogoIcon';
import NaverBlogIcon from './NaverBlogIcon';

const SERVICE_LINKS = ['AI스마트 브리핑', '도시별 인사이트 리포트', '내 출국 준비 로드맵'];
const POLICY_LINKS = ['개인정보처리방침', '이용약관', '공지사항', '문의하기', '제휴문의'];
const SNS_LINKS: { label: string; icon?: string }[] = [
  { label: 'Instagram', icon: snsInstagram },
  { label: 'YouTube', icon: snsYoutube },
  { label: 'Blog' },
];

export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-center gap-4 bg-gray-50">
      <div className="mx-auto flex w-full max-w-content flex-col items-center gap-10 px-4">
        <div className="flex w-full flex-col gap-1 pt-[30px]">
          <OmoLogoIcon className="h-5 w-auto shrink-0 self-start text-primary-600" />
          <p className="body-04 text-primary-600">
            Overseas, Make Obvious! 나에게 맞는 해외 도시 찾기부터 출국 준비까지
          </p>
        </div>

        <div className="flex w-full flex-wrap items-end justify-between gap-8">
          <div className="flex w-[306px] max-w-full flex-col gap-4 pb-8">
            <p className="body-05 text-gray-700">서울특별시 동작구 상도로 369 숭실대학교</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex gap-9">
                  <span className="body-05 text-gray-700">이메일 주소</span>
                  <span className="body-04 text-gray-700">cs@omo-travel.com</span>
                </div>
                <div className="flex gap-6">
                  <span className="body-05 text-gray-700">대표 전화번호</span>
                  <span className="body-04 text-gray-700">010-0000-0000</span>
                </div>
              </div>
              <p className="body-05 flex items-center gap-2 text-gray-700">
                해외 도시 탐색·출국 준비 로드맵 <span className="text-gray-200">|</span> 워홀·교환학생·인턴 준비생 대상
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              {SERVICE_LINKS.map((label) => (
                <div key={label} className="flex items-center gap-1">
                  <span className="body-05 w-[140px] text-gray-700">{label}</span>
                  <span className="size-icon-xs text-gray-700">〉</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 pr-3">
              {SNS_LINKS.map(({ label, icon }) => (
                <span
                  key={label}
                  className="flex size-[34px] items-center justify-center rounded-full bg-white"
                >
                  {icon ? <img src={icon} alt={label} className="size-6" /> : <NaverBlogIcon className="size-6" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-px">
        <hr className="w-full border-gray-200" />
        <div className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-2 px-4 pb-3">
          <div className="flex flex-wrap items-center">
            {POLICY_LINKS.map((label, index) => (
              <span
                key={label}
                className={`body-03 px-2.5 py-1 ${index === 0 ? 'title-03 text-primary-600' : 'text-gray-700'}`}
              >
                {label}
              </span>
            ))}
          </div>
          <p className="body-03 text-gray-700">© OMO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
