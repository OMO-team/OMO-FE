import { useState } from 'react';
import PromptInput from './PromptInput';
import suitcaseIcon from '../../../assets/icons/icon-suitcase[32].svg';

const SUGGESTION_CHIPS = [
  '치안이 좋고 영어로 생활 가능한 200만원 이하 도시',
  '유럽에서 생활비가 저렴하고 대중교통 좋은 곳',
  '아시아 워킹홀리데이 추천, 한 달 150만원 예산',
];

export default function AIPromptSection() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col items-start w-[1064px] gap-[48px]">

      {/* Frame 48: 타이틀 영역 */}
      <div className="flex flex-col items-start w-[563px] gap-4">
        <div className="flex flex-col items-start gap-2">
          <div className="w-8 h-8">
            <img src={suitcaseIcon} alt="여행" />
          </div>
          <h2 className="heading-01 text-gray-900">
            어느 나라로 떠나고 싶으신가요?
          </h2>
        </div>
        <p className="title-01 text-gray-600 self-stretch">
          원하는 조건이나 예산을 자유롭게 적으면, OMO AI가 딱 맞는 도시를 찾아드릴게요.
        </p>
      </div>

      {/* Frame 109: 입력창 + 추천 프롬프트 */}
      <div className="flex flex-col items-start gap-[36px]">
        <PromptInput value={inputValue} onChange={setInputValue} />

        {/* Frame 108: 추천 프롬프트 */}
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex items-center gap-7">
            <span className="title-01 text-gray-600">추천 프롬프트</span>
            <span className="title-01 text-gray-600">:</span>
          </div>

          <div className="flex flex-col items-start gap-3 self-stretch">
            <div className="flex items-center gap-3 self-stretch">
              {SUGGESTION_CHIPS.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => setInputValue(text)}
                  className="flex justify-center items-center w-[346px] h-[42px] px-5 py-[10px] gap-1 rounded-3 border border-gray-100 bg-gray-50 shadow-[0_2px_2.4px_0_rgba(44,54,78,0.20),0_4px_4px_0_rgba(58,70,94,0.12)] hover:bg-[#EEF6FF] hover:border-primary-200 transition-colors"
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
