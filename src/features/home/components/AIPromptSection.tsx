import arrowUpIcon from '../../assets/icons/icon-arrow-up.svg';
import PromptInput from './PromptInput';

const SUGGESTION_CHIPS = [
  '치안이 좋고 영어로 생활 가능한 200만원 이하 도시',
  '유럽에서 생활비가 저렴하고 대중교통 좋은 곳',
  '아시아 워킹홀리데이 추천, 한 달 150만원 예산',
];

export default function AIPromptSection() {
  return (
    <div className="flex flex-col items-start w-[1064px] gap-[48px]">

      {/* Frame 48: 타이틀 영역 */}
      <div className="flex flex-col items-start w-[563px] gap-4">
        {/* Frame 41: 아이콘 + 타이틀 + 서브타이틀 */}
        <div className="flex flex-col items-start gap-2">
          {/* 여행가방 아이콘 */}
          <div className="w-8 h-8">
            <img src="/src/assets/icons/Vector.svg" alt="여행" />
          </div>
          {/* 타이틀 */}
          <h2 className="heading-01 text-[#181A1F]">
            어느 나라로 떠나고 싶으신가요?
          </h2>
        </div>
        {/* 서브타이틀 */}
        <p className="title-01 text-gray-600 self-stretch">
          원하는 조건이나 예산을 자유롭게 적으면, OMO AI가 딱 맞는 도시를 찾아드릴게요.
        </p>
      </div>

      {/* Frame 109: 입력창 + 추천 프롬프트 */}
      <div className="flex flex-col items-start gap-[36px]">

        {/* 입력창 */}
        <PromptInput />

        {/* Frame 108: 추천 프롬프트 */}
        <div className="flex flex-col items-start gap-4 self-stretch">

          {/* 추천 프롬프트 레이블 */}
          <div className="flex items-center gap-7">
            <span className="title-01 text-gray-600">추천 프롬프트</span>
            <span className="title-01 text-gray-600">:</span>
          </div>

          {/* Frame 110: 칩 목록 */}
          <div className="flex flex-col items-start gap-3 self-stretch">
            {/* Frame 107: 칩 한 줄 */}
            <div className="flex items-center gap-3 self-stretch">
              {SUGGESTION_CHIPS.map((text) => (
                <button
                  key={text}
                  type="button"
                  className="flex justify-center items-center w-[346px] h-[42px] px-5 py-[10px] gap-1 rounded-[12px] border border-[#E7EAEF] bg-gray-50 shadow-[0_2px_2.4px_0_rgba(44,54,78,0.20),0_4px_4px_0_rgba(58,70,94,0.12)]"
                >
                  <span className="title-03 text-gray-700 w-[300px] text-center truncate">
                    {text}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
