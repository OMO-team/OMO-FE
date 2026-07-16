import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackHeader from '../components/BackHeader';
import TermsTabSwitcher from '../components/TermsTabSwitcher';
import { termsOfServiceChapters, privacyPolicyChapters, type ContentBlock } from '../mocks/termsContent';

const TABS = ['이용약관', '개인정보 처리방침'] as const;

type TermsAndPolicyPageProps = {
  isLoggedIn?: boolean;
  onBack?: () => void;
};

function ContentBlockView({ block }: { block: ContentBlock }) {
  if (block.type === 'text') {
    return (
      <>
        {block.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </>
    );
  }

  if (block.type === 'unordered') {
    return (
      <ul className="list-disc ms-10.5">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <ol className="list-decimal ms-5.25" start={block.start}>
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

export default function TermsAndPolicyPage({ isLoggedIn = true, onBack }: TermsAndPolicyPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const isTerms = activeTab === 0;
  const chapters = isTerms ? termsOfServiceChapters : privacyPolicyChapters;

  return (
    <div className="flex min-h-screen flex-col bg-gray-20">
      <Header isLoggedIn={isLoggedIn} userAvatarUrl={undefined} />

      <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-1 py-8">
        <BackHeader title="이용약관 및 정책" onBack={onBack} />

        <TermsTabSwitcher tabs={TABS} activeIndex={activeTab} onChange={setActiveTab} />

        <div className="mb-25 flex flex-col rounded-4 bg-white px-10 py-8">
          {!isTerms && (
            <div className="body-03 mb-8 flex flex-col gap-1 text-gray-700">
              <p>
                OMO는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고
                원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
              </p>
              <p className="text-gray-500">시행일자: 0000년 00월 00일</p>
            </div>
          )}

          <div className="flex flex-col gap-18.5">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.title ?? chapterIndex} className="flex flex-col gap-7.5">
                {chapter.title && <p className="title-01 text-gray-900">{chapter.title}</p>}
                <div className="flex flex-col gap-6">
                  {chapter.sections.map((section) => (
                    <div key={section.heading} className="flex flex-col gap-2">
                      {isTerms ? (
                        <p className="body-02 flex items-center gap-1 text-gray-700">
                          <span aria-hidden="true">•</span>
                          <span>{section.heading}</span>
                        </p>
                      ) : (
                        <p className="title-05 text-gray-900">{section.heading}</p>
                      )}
                      <div className="body-03 flex flex-col gap-1 leading-normal text-gray-700">
                        {section.blocks.map((block, blockIndex) => (
                          <ContentBlockView key={blockIndex} block={block} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {isTerms && (
            <div className="mt-14 flex flex-col gap-1">
              <p className="text-base font-normal leading-[1.4] tracking-[-0.02em] text-gray-900">부칙</p>
              <p className="body-02 text-gray-900">본 약관은 2026년 00월 00일부터 시행합니다.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
