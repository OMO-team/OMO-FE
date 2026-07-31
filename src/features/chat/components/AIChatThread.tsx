import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import thinkingIcon from '../../../assets/icons/icon-thinking.svg';
import checkConditionIcon from '../../../assets/icons/icon-check-condition.svg';
import chevronRightBlueIcon from '../../../assets/icons/icon-chevron-right-blue.svg';
import externalLinkIcon from '../../../assets/icons/icon-external-link.svg';
import UserChatBubble from './UserChatBubble';
import type { BriefingData, ResourceDTO } from '../types/dto';

type AIChatThreadProps = {
  userMessage: string;
  thinkingTime: number;
  briefingData: BriefingData;
};

const RESOURCE_TYPE_LABEL: Record<string, { label: string; bgClass: string; textClass: string }> = {
  OFFICIAL: { label: '공식', bgClass: 'bg-primary-50', textClass: 'text-primary-700' },
  BLOG: { label: '블로그', bgClass: 'bg-secondary-50', textClass: 'text-secondary-700' },
  REPORT: { label: '보고서', bgClass: 'bg-primary-50', textClass: 'text-primary-700' },
};

const divider = (
  <div
    className="bg-gray-100 flex-shrink-0"
    style={{ width: '360px', height: '2px', borderRadius: '10px' }}
  />
);

function ResourceCard({ resource }: { resource: ResourceDTO }) {
  const [hovered, setHovered] = useState(false);
  const tag = RESOURCE_TYPE_LABEL[resource.resourceType] ?? {
    label: resource.resourceType,
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700',
  };

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col items-start gap-1 rounded-2 border border-gray-100 transition-colors ${hovered ? 'bg-gray-50' : 'bg-white'}`}
      style={{ padding: '8px 16px', alignSelf: 'stretch' }}
    >
      <div className="flex items-center justify-center gap-2" style={{ height: '26px', alignSelf: 'stretch' }}>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center gap-1 rounded-2 flex-shrink-0 ${tag.bgClass}`}
            style={{ height: '24px', padding: '4px 12px' }}
          >
            <span className={`body-05 ${tag.textClass}`}>{tag.label}</span>
          </div>
          <span
            className="body-04 text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ width: '194px' }}
          >
            {resource.title}
          </span>
        </div>
        <div className="size-icon-sm flex items-center justify-center flex-shrink-0">
          <img src={externalLinkIcon} alt="외부 링크" width={16} height={16} />
        </div>
      </div>
    </a>
  );
}

export default function AIChatThread({ userMessage, thinkingTime, briefingData }: AIChatThreadProps) {
  const navigate = useNavigate();
  const paragraphs = briefingData.summary.split('\n').filter(Boolean);
  const firstCity = briefingData.recommendedCities[0];

  return (
    <div
      className="flex flex-col items-start"
      style={{ padding: '76px 50px 0 50px', gap: '4px', alignSelf: 'stretch' }}
    >
      <div className="flex flex-col items-start" style={{ alignSelf: 'stretch' }}>

        {/* 유저 메시지 */}
        <div
          className="flex flex-col items-end"
          style={{ padding: '40px 0 40px 160px', gap: '4px', alignSelf: 'stretch' }}
        >
          <UserChatBubble text={userMessage} />
        </div>

        {/* AI 응답 */}
        <div className="flex flex-col items-start gap-2" style={{ width: '360px' }}>

          {/* 생각 시간 */}
          <div className="flex items-center gap-2">
            <div className="size-icon-md flex items-center justify-center">
              <img src={thinkingIcon} alt="생각 중" width={18} height={20} />
            </div>
            <span className="body-04 text-gray-300">{thinkingTime}s 동안 생각함</span>
          </div>

          {/* 응답 본문 */}
          <div className="flex flex-col items-start gap-6" style={{ alignSelf: 'stretch' }}>
            <div className="flex flex-col items-start gap-[30px]" style={{ alignSelf: 'stretch' }}>
              <div className="flex flex-col items-start gap-4" style={{ alignSelf: 'stretch' }}>
                <div className="flex flex-col items-start gap-6" style={{ alignSelf: 'stretch' }}>

                  {/* 요약 텍스트 */}
                  <div className="flex flex-col items-start gap-3" style={{ alignSelf: 'stretch' }}>
                    {paragraphs.map((text, i) => (
                      <>
                        <p
                          key={text}
                          className="text-black"
                          style={{
                            fontFamily: 'var(--font-pretendard)',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '150%',
                            letterSpacing: '-0.28px',
                            alignSelf: 'stretch',
                          }}
                        >
                          {text}
                        </p>
                        {i < paragraphs.length - 1 && divider}
                      </>
                    ))}
                  </div>

                  {/* 조건 태그 */}
                  {briefingData.extractedTags.length > 0 && (
                    <div className="flex flex-col items-start gap-2" style={{ width: '265px' }}>
                      <div className="flex items-center gap-2 flex-wrap" style={{ alignSelf: 'stretch' }}>
                        {briefingData.extractedTags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center justify-center gap-1 rounded-2 bg-primary-50"
                            style={{ padding: '4px 10px 4px 8px' }}
                          >
                            <div className="size-icon-sm flex items-center justify-center flex-shrink-0">
                              <img src={checkConditionIcon} alt="체크" width={14} height={10} />
                            </div>
                            <span className="body-04 text-primary-700">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 추천 도시 보러가기 */}
                {firstCity && (
                  <button
                    type="button"
                    onClick={() => navigate(`/city-insight`)}
                    className="flex items-start gap-1"
                    style={{ alignSelf: 'stretch' }}
                  >
                    <span
                      className="body-02 text-primary-500 underline"
                      style={{ textDecorationStyle: 'solid' }}
                    >
                      추천 도시 보러가기
                    </span>
                    <div className="size-icon-sm flex items-center justify-center">
                      <img src={chevronRightBlueIcon} alt="이동" width={6} height={12} />
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* 참고자료 */}
            {briefingData.resources.length > 0 && (
              <>
                <div className="flex flex-col items-start" style={{ alignSelf: 'stretch' }}>
                  {divider}
                </div>
                <div
                  className="flex items-center gap-1"
                  style={{ padding: '12px 16px 8px 16px', alignSelf: 'stretch' }}
                >
                  <span className="body-04 text-gray-500">참고자료</span>
                </div>
                <div className="flex flex-col items-start gap-2" style={{ width: '317px' }}>
                  {briefingData.resources.map((resource) => (
                    <ResourceCard key={resource.url} resource={resource} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
