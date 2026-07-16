type TermsTabSwitcherProps = {
  tabs: readonly string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export default function TermsTabSwitcher({ tabs, activeIndex, onChange }: TermsTabSwitcherProps) {
  return (
    <div className="flex w-full">
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        const isLeft = index === 0;
        const outerSide = isLeft ? 'border-l' : 'border-r';

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(index)}
            className={`flex flex-1 items-center justify-center py-3.75 ${isLeft ? 'rounded-l-4' : 'rounded-r-4'} ${
              isActive
                ? 'title-05 border border-primary-500 bg-primary-50 text-primary-500'
                : `body-01 border-y ${outerSide} border-gray-200 text-gray-500`
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
