type CityHeroBannerProps = {
  cityName: string;
  progressPercent: number;
  imageUrl: string;
};

export default function CityHeroBanner({ cityName, progressPercent, imageUrl }: CityHeroBannerProps) {
  return (
    <div
      className="relative h-[590px] w-full rounded-b-5 bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 rounded-b-5 bg-gradient-to-t from-primary-900/40 to-transparent" />
      {/* 아래 본문과 같은 왼쪽 여백 공식을 써서 히어로 텍스트의 왼쪽 경계도 헤더/본문과 같은 수직선에 맞춘다 */}
      <div className="relative flex h-full w-full flex-wrap items-end justify-between gap-2 pb-12 pl-[clamp(32px,50vw_-_451.5px,188px)] pr-8">
        <p className="heading-01 font-semibold text-white">{cityName} 출국 준비</p>
        <p className="heading-05 text-white">진행률 {progressPercent}%</p>
      </div>
    </div>
  );
}
