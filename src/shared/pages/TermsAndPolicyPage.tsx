import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import BackHeader from '../components/BackHeader';
import TermsTabSwitcher from '../components/TermsTabSwitcher';
import { useTerms } from '../../features/auth/hooks/useTerms';
import type { TermType } from '../../features/auth/types/dto';

const TABS = ['이용약관', '개인정보 처리방침'] as const;
const TAB_TYPES: readonly TermType[] = ['TERMS_OF_SERVICE', 'PRIVACY_POLICY'];

type TermsAndPolicyPageProps = {
  onBack?: () => void;
  initialTab?: number;
};

function getMarkdownComponents(isTerms: boolean): Components {
  return {
    h2: (props) => <p className="title-01 mt-10 mb-4 text-gray-900 first:mt-0" {...props} />,
    h3: (props) =>
      isTerms ? (
        <p className="body-02 mt-4 mb-1 flex items-center gap-1 text-gray-700">
          <span aria-hidden="true">•</span>
          <span {...props} />
        </p>
      ) : (
        <p className="title-05 mt-6 mb-1 text-gray-900" {...props} />
      ),
    p: (props) => <p className="body-03 mb-1 leading-normal text-gray-700" {...props} />,
    strong: (props) => <strong className="font-semibold text-gray-900" {...props} />,
    ul: (props) => <ul className="body-03 mb-1 list-disc text-gray-700 ms-10.5" {...props} />,
    ol: (props) => <ol className="body-03 mb-1 list-decimal text-gray-700 ms-5.25" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    blockquote: (props) => (
      <blockquote className="body-03 border-l-2 border-gray-300 pl-3 text-gray-500" {...props} />
    ),
  };
}

export default function TermsAndPolicyPage({ onBack, initialTab = 0 }: TermsAndPolicyPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const isTerms = activeTab === 0;

  const { data: termsData, isLoading, isError } = useTerms();
  const term = termsData?.terms.find((t) => t.type === TAB_TYPES[activeTab]);

  return (
    <div className="flex flex-col bg-gray-20">
      <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-1 py-8">
        <BackHeader title="이용약관 및 정책" onBack={onBack} />

        <TermsTabSwitcher tabs={TABS} activeIndex={activeTab} onChange={setActiveTab} />

        <div className="mb-25 flex flex-col rounded-4 bg-white px-10 py-8">
          {isLoading && <p className="body-02 text-gray-500">약관을 불러오는 중...</p>}
          {isError && (
            <p className="body-02 text-red-500">약관을 불러오지 못했어요. 다시 시도해주세요.</p>
          )}
          {term && (
            <ReactMarkdown components={getMarkdownComponents(isTerms)}>
              {term.content}
            </ReactMarkdown>
          )}
        </div>
      </main>
    </div>
  );
}
