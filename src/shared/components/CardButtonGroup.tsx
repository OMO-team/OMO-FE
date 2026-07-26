interface CardButtonGroupProps {
  onCompare: () => void
  onReport: () => void
}

export default function CardButtonGroup({ onCompare, onReport }: CardButtonGroupProps) {
  return (
    <div className="flex gap-[10px]">
      <button
        type="button"
        className="title-02 w-1/3 rounded-2 py-3 bg-gray-100 text-gray-600"
        onClick={onCompare}
      >
        비교함에 담기
      </button>
      <button
        type="button"
        className="title-02 flex-1 rounded-2 py-3 bg-primary-500 text-white"
        onClick={onReport}
      >
        AI 탐색 리포트
      </button>
    </div>
  )
}
