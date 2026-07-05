type AiReportCardProps = {
  score: number;
  cityName: string;
  summary: string;
  onViewReport?: () => void;
};

export default function AiReportCard({ score, cityName, summary, onViewReport }: AiReportCardProps) {
  return (
    <div className="flex w-[434px] flex-col gap-[30px] rounded-4 bg-white px-4 py-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="heading-06 flex items-center gap-1 text-primary-500">
            <svg viewBox="0 0 28 28" fill="none" className="size-icon-lg" aria-hidden>
              <path
                d="M13.9995 20.8711L9.06879 23.9811C8.85096 24.1262 8.62324 24.1884 8.38561 24.1677C8.14799 24.147 7.94007 24.064 7.76185 23.9189C7.58363 23.7738 7.44502 23.5926 7.34601 23.3753C7.247 23.158 7.2272 22.9142 7.2866 22.6438L8.59354 16.7658L4.22719 12.8161C4.02917 12.6295 3.9056 12.4168 3.85649 12.1779C3.80738 11.9391 3.82204 11.706 3.90045 11.4788C3.97887 11.2516 4.09768 11.065 4.25689 10.919C4.4161 10.773 4.63392 10.6797 4.91036 10.6391L10.6728 10.1104L12.9005 4.57453C12.9995 4.32573 13.1532 4.13913 13.3615 4.01473C13.5698 3.89033 13.7825 3.82812 13.9995 3.82812C14.2165 3.82813 14.4292 3.89033 14.6375 4.01473C14.8458 4.13913 14.9995 4.32573 15.0985 4.57453L17.3262 10.1104L23.0886 10.6391C23.3659 10.6806 23.5837 10.7739 23.7421 10.919C23.9005 11.0641 24.0193 11.2507 24.0985 11.4788C24.1777 11.7069 24.1928 11.9403 24.1437 12.1792C24.0946 12.418 23.9706 12.6303 23.7718 12.8161L19.4054 16.7658L20.7124 22.6438C20.7718 22.9133 20.752 23.1572 20.653 23.3753C20.554 23.5934 20.4154 23.7746 20.2371 23.9189C20.0589 24.0632 19.851 24.1461 19.6134 24.1677C19.3757 24.1893 19.148 24.1271 18.9302 23.9811L13.9995 20.8711Z"
                fill="currentColor"
              />
            </svg>{' '}
            총점 {score}
          </span>
          <span className="title-02 text-gray-500">{cityName} 한줄 요약</span>
        </div>
        <p className="title-02 text-primary-900">{summary}</p>
      </div>
      <button
        type="button"
        className="title-03 flex h-10 items-center justify-center gap-1 rounded-2 bg-primary-100 text-primary-500"
        onClick={onViewReport}
      >
        AI 리포트 보러가기 〉
      </button>
    </div>
  );
}
