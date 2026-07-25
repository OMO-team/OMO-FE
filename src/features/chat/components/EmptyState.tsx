type EmptyStateProps =
  | { type: 'no-result' | 'error'; onAction: () => void }
  | { type: 'too-vague' | 'out-of-scope'; onAction?: never };

const CONFIG = {
  'no-result': {
    iconBg: 'rgba(21, 93, 252, 0.09)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15" fill="none">
        <path d="M8.15349 5.13379L5.13379 8.15349" stroke="#155DFC" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.13379 5.13379L8.15349 8.15349" stroke="#155DFC" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.64304 11.4746C9.31142 11.4746 11.4746 9.31142 11.4746 6.64304C11.4746 3.97467 9.31142 1.81152 6.64304 1.81152C3.97467 1.81152 1.81152 3.97467 1.81152 6.64304C1.81152 9.31142 3.97467 11.4746 6.64304 11.4746Z" stroke="#155DFC" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.6829 12.6829L10.0859 10.0859" stroke="#155DFC" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: '조건에 맞는 정보를 찾지 못했어요',
    description: '다르게 물어봐 주세요',
    button: { label: '다시 검색', color: 'bg-[#155DFC]' },
  },
  error: {
    iconBg: 'rgba(220, 38, 38, 0.09)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15" fill="none">
        <g clipPath="url(#clip-error)">
          <path d="M8.25586 4.83105H10.8709C11.1913 4.83105 11.4985 4.95831 11.725 5.18483C11.9515 5.41136 12.0788 5.71859 12.0788 6.03894V8.654" stroke="#DC2626" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.20801 8.45508H2.41589" stroke="#DC2626" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.0791 8.45508H13.287" stroke="#DC2626" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.2868 13.2868L1.20801 1.20801" stroke="#DC2626" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.83178 4.83105H3.6239C3.30355 4.83105 2.99632 4.95831 2.7698 5.18483C2.54327 5.41136 2.41602 5.71859 2.41602 6.03894V10.8705C2.41602 11.1908 2.54327 11.498 2.7698 11.7246C2.99632 11.9511 3.30355 12.0783 3.6239 12.0783H10.8712C11.1915 12.0783 11.4987 11.951 11.7252 11.7244" stroke="#DC2626" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.43555 7.85156V9.05944" stroke="#DC2626" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.83984 2.41602H7.24702V3.8232" stroke="#DC2626" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip-error">
            <rect width="14.4946" height="14.4946" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    ),
    title: '브리핑 생성에 실패했어요',
    description: '다시 시도해 주세요',
    button: { label: '다시 시도', color: 'bg-red-600' },
  },
  'too-vague': {
    iconBg: 'rgba(234, 88, 12, 0.09)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15" fill="none">
        <path d="M12.6824 9.05881C12.6824 9.37916 12.5552 9.68639 12.3287 9.91291C12.1021 10.1394 11.7949 10.2667 11.4746 10.2667H4.22728L1.81152 12.6824V3.0194C1.81152 2.69905 1.93878 2.39182 2.1653 2.1653C2.39182 1.93878 2.69905 1.81152 3.0194 1.81152H11.4746C11.7949 1.81152 12.1021 1.93878 12.3287 2.1653C12.5552 2.39182 12.6824 2.69905 12.6824 3.0194V9.05881Z" stroke="#EA580C" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.24707 4.22754V5.43542" stroke="#EA580C" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.24707 7.85156H7.25401" stroke="#EA580C" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: '조금 더 구체적으로 입력해 주세요',
    description: "예: '베를린 비자 신청 절차'",
    button: null,
  },
  'out-of-scope': {
    iconBg: 'rgba(202, 138, 4, 0.09)',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15" fill="none">
        <g clipPath="url(#clip-scope)">
          <path d="M12.0791 7.85162C12.0791 10.8713 9.96527 12.3812 7.45288 13.2569C7.32132 13.3015 7.17841 13.2993 7.04824 13.2508C4.52981 12.3812 2.41602 10.8713 2.41602 7.85162V3.62404C2.41602 3.46387 2.47964 3.31025 2.59291 3.19699C2.70617 3.08373 2.85978 3.0201 3.01996 3.0201C4.22784 3.0201 5.73769 2.29537 6.78854 1.37738C6.91649 1.26807 7.07925 1.20801 7.24754 1.20801C7.41582 1.20801 7.57858 1.26807 7.70653 1.37738C8.76343 2.30141 10.2672 3.0201 11.4751 3.0201C11.6353 3.0201 11.7889 3.08373 11.9022 3.19699C12.0154 3.31025 12.0791 3.46387 12.0791 3.62404V7.85162Z" stroke="#CA8A04" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.24707 4.83203V7.24779" stroke="#CA8A04" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.24707 9.66309H7.25401" stroke="#CA8A04" strokeWidth="1.20788" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip-scope">
            <rect width="14.4946" height="14.4946" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    ),
    title: '이 서비스는 해외 체류 준비 정보만 안내해요',
    description: '다른 내용은 검색창에서 도움받기 어려워요',
    button: null,
  },
} as const;

export default function EmptyState({ type, onAction }: EmptyStateProps) {
  const { iconBg, icon, title, description, button } = CONFIG[type];

  return (
    <div className="flex w-full flex-col items-center rounded-2 border border-gray-100 bg-gray-50 px-3 py-5">
      {/* 아이콘 */}
      <div className="mb-[8px] flex items-center justify-center rounded-2 p-[8px]" style={{ background: iconBg }}>
        {icon}
      </div>

      {/* 텍스트 */}
      <div className="mb-[2px] flex flex-col items-center gap-[2px]">
        <p className="body-02 text-center font-bold text-gray-900">{title}</p>
        <p className="body-03 text-center text-gray-500">{description}</p>
      </div>

      {/* 버튼 */}
      {button && (
        <div className="mt-[8px]">
          <button
            type="button"
            onClick={onAction}
            className={`${button.color} rounded-[5px] px-[8px] py-[4px] body-04 font-semibold text-white`}
          >
            {button.label}
          </button>
        </div>
      )}
    </div>
  );
}
