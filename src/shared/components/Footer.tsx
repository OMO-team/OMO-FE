import { Link } from 'react-router-dom';
import OmoLogoIcon from './OmoLogoIcon';
import ChevronIcon from './ChevronIcon';
import NaverBlogIcon from './NaverBlogIcon';
import InstagramIcon from './InstagramIcon';
import YoutubeIcon from './YoutubeIcon';

type LinkItem = {
  label: string;
  path?: string;
  onClick?: () => void;
};

const POLICY_LINKS: LinkItem[] = [
  { label: '개인정보처리방침', path: '/support/terms' },
  { label: '이용약관', path: '/support/terms' },
  { label: '공지사항' },
  { label: '문의하기', path: '/contact' },
  { label: '제휴문의' },
];

const SNS_LINKS = [
  {
    label: 'Instagram',
    icon: <InstagramIcon className="size-5" />,
    url: 'https://www.instagram.com/omo.team.official',
  },
  {
    label: 'YouTube',
    icon: <YoutubeIcon className="size-5" />,
    url: 'https://www.youtube.com/@omo-team-official',
  },
  {
    label: 'Blog',
    icon: <NaverBlogIcon className="size-5" />,
    url: 'https://blog.naver.com/omo-official',
  },
];

type FooterProps = {
  onOpenSmartBriefing?: () => void;
};

export default function Footer({ onOpenSmartBriefing }: FooterProps) {
  const serviceLinks: LinkItem[] = [
    { label: 'AI스마트 브리핑', onClick: onOpenSmartBriefing },
    { label: '도시별 인사이트 리포트', path: '/city-insight' },
    { label: '내 출국 준비 로드맵', path: '/myhome' },
  ];

  return (
    <footer className="flex w-full flex-col items-center gap-4 bg-gray-100">
      <div className="mx-auto flex w-full max-w-content flex-col items-center gap-10 px-4">
        <div className="flex w-full flex-col gap-1 pt-7.5">
          <OmoLogoIcon className="h-5 w-auto shrink-0 self-start text-primary-600" />
          <p className="body-04 text-primary-600">
            Overseas, Make Obvious! 나에게 맞는 해외 도시 찾기부터 출국 준비까지
          </p>
        </div>

        <div className="flex w-full flex-wrap items-end justify-between gap-8">
          <div className="flex w-max max-w-full flex-col gap-4 pb-8">
            <p className="body-05 text-gray-700">서울특별시 동작구 상도로 369 숭실대학교</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex gap-9">
                  <span className="body-05 text-gray-700">이메일 주소</span>
                  <span className="body-04 text-gray-700">omo.team.official@gmail.com</span>
                </div>
                <div className="flex gap-6">
                  <span className="body-05 text-gray-700">대표 전화번호</span>
                  <span className="body-04 text-gray-700">010-2488-0122</span>
                </div>
              </div>
              <p className="body-05 flex items-center gap-2 whitespace-nowrap text-gray-700">
                해외 도시 탐색·출국 준비 로드맵 <span className="text-gray-200">|</span>{' '}
                워홀·교환학생·인턴 준비생 대상
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              {serviceLinks.map(({ label, path, onClick }) =>
                path ? (
                  <Link key={label} to={path} className="flex items-center gap-1">
                    <span className="body-05 w-35 text-gray-700">{label}</span>
                    <ChevronIcon className="size-icon-xs rotate-180 text-gray-700" />
                  </Link>
                ) : onClick ? (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    className="flex items-center gap-1 text-left"
                  >
                    <span className="body-05 w-35 text-gray-700">{label}</span>
                    <ChevronIcon className="size-icon-xs rotate-180 text-gray-700" />
                  </button>
                ) : (
                  <span key={label} className="body-05 w-35 text-gray-700">
                    {label}
                  </span>
                )
              )}
            </div>
            <div className="flex items-center justify-end gap-2 pr-3">
              {SNS_LINKS.map(({ label, icon, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-8.5 items-center justify-center rounded-full bg-white hover:opacity-80 transition-opacity"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-px">
        <hr className="w-full border-gray-100 mb-4" />
        <div className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-2 px-4 pb-3">
          <div className="flex flex-wrap items-center">
            {POLICY_LINKS.map(({ label, path }, index) => {
              const className = `body-03 px-2.5 py-1 ${index === 0 ? 'title-03 text-primary-600' : 'text-gray-700'}`;
              return path ? (
                <Link key={label} to={path} className={className}>
                  {label}
                </Link>
              ) : (
                <span key={label} className={className}>
                  {label}
                </span>
              );
            })}
          </div>
          <p className="body-03 text-gray-600">© OMO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
