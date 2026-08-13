import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import thinkingIcon from '../../../assets/icons/icon-thinking.svg';
import checkConditionIcon from '../../../assets/icons/icon-check-condition.svg';
import chevronRightBlueIcon from '../../../assets/icons/icon-chevron-right-blue.svg';
import externalLinkIcon from '../../../assets/icons/icon-external-link.svg';
import UserChatBubble from './UserChatBubble';
import type { BriefingData, ResourceDTO } from '../types/dto';
import { parseSearchQuery, hasStructuredCondition } from '../../city-insight/utils/parseSearchQuery';

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
    style={{ alignSelf: 'stretch', height: '2px', borderRadius: '10px' }}
  />
);

function ResourceCard({ resource }: { resource: ResourceDTO }) {
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
      className="flex flex-col items-start gap-1 rounded-2 border border-gray-100 bg-white transition-colors hover:bg-gray-50"
      style={{ padding: '8px 16px', alignSelf: 'stretch' }}
    >
      <div className="flex items-center justify-center gap-2" style={{ height: '26px', alignSelf: 'stretch' }}>
        <div className="flex items-center gap-2" style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div
            className={`flex items-center justify-center gap-1 rounded-2 flex-shrink-0 ${tag.bgClass}`}
            style={{ height: '24px', padding: '4px 12px' }}
          >
            <span className={`body-05 ${tag.textClass}`}>{tag.label}</span>
          </div>
          <span
            className="body-04 text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ flex: '1 1 auto', minWidth: 0 }}
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

  /** 조건 태그(치안 우수, 영어 소통 가능 등)를 도시 탐색 화면의 필터로 변환해 이동 —
   *  원 질문 문장을 먼저 파싱한 뒤 태그에서 뽑은 조건으로 덮어써서 합친다. 문장 파싱만으로는
   *  "비자 어렵지 않으며"처럼 부정 표현을 오독할 수 있어(어렵지→HARD로 걸림), 더 정제된 표현인
   *  태그값을 우선하되, 태그에 없는 조건(체류 기간·대륙 등)은 문장 파싱 결과를 그대로 살린다.
   *  둘 다 조건을 못 뽑으면 기존처럼 AI가 추천한 도시 3개만 보여준다 */
  const handleGoToCities = () => {
    const fromMessage = parseSearchQuery(userMessage);
    const fromTags = parseSearchQuery(briefingData.extractedTags.join(' '));
    const merged = {
      params: { ...fromMessage.params, ...fromTags.params },
      minLanguageScore: fromTags.minLanguageScore ?? fromMessage.minLanguageScore,
      minInfraScore: fromTags.minInfraScore ?? fromMessage.minInfraScore,
      minRating: fromTags.minRating ?? fromMessage.minRating,
    };

    if (hasStructuredCondition(merged)) {
      navigate('/city-insight', {
        state: {
          parsedSearch: {
            query: userMessage,
            ...merged,
            // AI가 채팅에서 보여준 조건 태그 문구를 그대로 전달 — 탐색 화면에서 다시 "N점 이상" 같은
            // 기계적인 문구로 재생성하지 않고 채팅과 동일한 표현("치안 우수" 등)을 유지하기 위함
            conditionLabels: briefingData.extractedTags,
          },
        },
      });
    } else {
      navigate('/city-insight', { state: { recommendedCities: briefingData.recommendedCities } });
    }
  };

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
        <div className="flex flex-col items-start gap-2" style={{ alignSelf: 'stretch' }}>

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
                      <Fragment key={`${i}-${text}`}>
                        <p className="body-03 text-gray-900 self-stretch">{text}</p>
                        {i < paragraphs.length - 1 && divider}
                      </Fragment>
                    ))}
                  </div>

                  {/* 조건 태그 */}
                  {briefingData.extractedTags.length > 0 && (
                    <div className="flex flex-col items-start gap-2" style={{ alignSelf: 'stretch' }}>
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
                    onClick={handleGoToCities}
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
                <div className="flex flex-col items-start gap-2" style={{ alignSelf: 'stretch' }}>
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
