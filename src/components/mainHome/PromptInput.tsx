import { useState } from 'react';

type PromptInputProps = {
  onSubmit?: (value: string) => void;
};

export default function PromptInput({ onSubmit }: PromptInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit?.(value);
  };

  return (
    <div className="flex flex-col justify-end items-end w-[1064px] pt-6 px-9 pb-5 gap-1 rounded-[12px] border border-[#E7EAEF] bg-white shadow-[0_8px_14px_0_rgba(6,49,88,0.20)]">
      {/* Frame 113 */}
      <div className="flex flex-col items-start self-stretch">

        {/* Frame 111: 텍스트 입력 영역 */}
        <div className="flex pb-3 justify-center items-center gap-1 self-stretch">
          <textarea
            className="h-[50px] flex-1 resize-none outline-none title-01 text-gray-800 placeholder:text-gray-400 bg-transparent"
            placeholder="영어로 생활 가능하고, 한 달 예산 200만 원 이하인 유럽 도시 추천해 줘"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        {/* Frame 112: 전송 버튼 */}
        <div className="flex justify-end items-center gap-1 self-stretch">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex justify-center items-center p-[10px] rounded-full bg-primary-500"
          >
            <span className="flex justify-center items-center w-7 h-7">
              <img src="/src/assets/icons/Vector.svg" alt="전송" width={17} height={17} />
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
