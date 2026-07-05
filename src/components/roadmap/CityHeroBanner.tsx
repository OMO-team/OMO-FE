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
      <div className="relative mx-auto flex h-full max-w-content items-end justify-between px-4 pb-12">
        <p className="heading-01 text-white">{cityName} 출국 준비</p>
        <p className="heading-05 text-white">진행률 {progressPercent}%</p>
      </div>
    </div>
  );
}
