import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import leftArrowIcon from '../assets/icons/icon-left-arrow[28].svg';

type Tab = 'terms' | 'privacy';

type Article = {
  title: string;
  content: string;
};

type Chapter = {
  chapter: string;
  articles: Article[];
};

const TERMS_CHAPTERS: Chapter[] = [
  {
    chapter: '제 1장 총칙',
    articles: [
      {
        title: '제1조 (목적)',
        content: `본 약관은 [OMO] (이하 "회사")가 제공하는 OMO 및 관련 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 서비스 이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.`,
      },
      {
        title: '제2조 (용어의 정의)',
        content: `본 약관에서 사용하는 용어의 정의는 다음과 같습니다.

"서비스"란 회사가 제공하는, 해외 체류(교환학생·워킹홀리데이·해외 인턴십 등) 준비에 필요한 공개 경험 정보를 수집·요약·태깅하여 이용자의 질문 단위로 묶어 제공하는 메타서치 및 AI 브리핑 서비스를 말합니다.
"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
"비회원"이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
"콘텐츠"란 회사가 서비스에서 제공하는 부호·문자·음성·음향·이미지·영상 등의 정보, AI 요약·브리핑 결과물, 태그, 외부 출처로 연결되는 링크(아웃링크) 등 일체의 정보를 말합니다.
"AI 브리핑"이란 회사가 외부 공개 출처로부터 수집한 정보를 가공·요약하여 이용자의 질의에 대한 응답 형태로 제공하는 결과물을 말합니다.
"외부 출처"란 블로그, 커뮤니티, 보고서, 브이로그 등 회사가 정보를 수집하는 제3자의 웹사이트 또는 게시물을 말합니다.`,
      },
      {
        title: '제3조 (약관의 게시와 개정)',
        content: `회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면 또는 연결 화면에 게시합니다.
회사는 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」(이하 "정보통신망법"), 「콘텐츠산업 진흥법」 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 적용일자 7일 전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관을 개정하는 경우에는 최소 30일 전부터 공지하며, 기존 회원에게는 전자적 수단(이메일, 서비스 내 알림 등)으로 개별 통지합니다.
회사가 제3항에 따라 개정약관을 공지·통지하면서 이용자에게 적용일자 전일까지 거부의사를 표시하지 않으면 동의한 것으로 본다는 뜻을 명확하게 고지하였음에도 이용자가 명시적으로 거부의사를 표시하지 않은 경우, 이용자가 개정약관에 동의한 것으로 봅니다.
이용자가 개정약관에 동의하지 않는 경우 회사는 개정약관을 적용할 수 없으며, 이 경우 이용자는 이용계약을 해지할 수 있습니다.`,
      },
      {
        title: '제4조 (약관의 해석)',
        content: `본 약관에서 정하지 아니한 사항과 본 약관의 해석에 관하여는 「약관의 규제에 관한 법률」, 「전자상거래 등에서의 소비자보호에 관한 법률」, 「정보통신망법」 등 관련 법령 또는 상관례에 따릅니다.`,
      },
    ],
  },
  {
    chapter: '제 2장 이용계약의 체결',
    articles: [
      {
        title: '제5조 (이용계약의 성립)',
        content: `이용계약은 이용자가 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 동의한 다음 회사가 정한 양식에 따라 회원정보를 기입하여 회원가입을 신청하고, 회사가 이를 승낙함으로써 성립합니다.
비회원의 경우 본 약관에 동의하고 서비스를 이용함으로써 이용계약이 성립한 것으로 봅니다.`,
      },
      {
        title: '제6조 (이용신청의 승낙과 제한)',
        content: `회사는 가입신청자의 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다.
회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
타인의 명의를 이용하거나 허위 정보를 기재한 경우
만 14세 미만 아동이 법정대리인의 동의 없이 신청한 경우
부정한 용도로 서비스를 이용하고자 하는 경우
관련 법령에 위배되거나 사회의 안녕, 질서, 미풍양속을 저해할 목적으로 신청한 경우
회사는 서비스 관련 설비의 여유가 없거나, 기술상·업무상 문제가 있는 경우에는 승낙을 유보할 수 있습니다.`,
      },
      {
        title: '제7조 (만 14세 미만 아동)',
        content: `회사는 만 14세 미만 아동에 대하여 서비스를 제공하지 않으며, 회원가입을 받지 않습니다. 만 14세 미만 아동이 서비스를 이용하고자 하는 경우 「개인정보 보호법」 제22조의2에 따라 법정대리인의 동의가 필요하며, 회사가 이를 확인할 수 없는 경우 이용을 제한할 수 있습니다.`,
      },
    ],
  },
  {
    chapter: '제 3장 서비스의 이용',
    articles: [
      {
        title: '제8조 (서비스의 제공)',
        content: `회사는 다음과 같은 서비스를 제공합니다.
해외 체류 준비를 위한 도시·국가별 공개 경험 정보의 수집·요약·태깅 및 브리핑
외부 출처로 연결되는 링크(아웃링크) 제공
이용자 질의에 대한 AI 기반 정보 검색 및 요약
체류 준비 로드맵, 예산 시뮬레이션 등 부가 기능
기타 회사가 정하는 서비스
회사는 서비스를 일정 범위로 분할하여 각 범위별로 이용 가능 시간 등을 별도로 정할 수 있습니다.`,
      },
      {
        title: '제9조 (정보 제공의 성격 및 한계)',
        content: `회사가 제공하는 정보는 객관적으로 검증된 사실이 아니라, 이용자의 질문과 연관성이 높은 외부 공개 경험 정보를 묶어 제공하는 큐레이션입니다.
회사는 "무엇을 봐야 하는지"를 좁혀주는 큐레이터로서의 역할을 수행하며, 제공되는 정보의 정확성·완전성·최신성·신뢰성을 보증하지 않습니다. 모든 정보의 원본 출처는 링크로 노출되며, 최종적인 사실 판단 및 의사결정의 책임은 이용자 본인에게 있습니다.
치안·물가·비자·체류 요건 등의 정보는 시점·개인의 상황에 따라 달라질 수 있으므로, 이용자는 중요한 의사결정 전 반드시 해당 국가의 공식 기관(대사관, 출입국 당국 등) 또는 원문 출처를 통해 직접 확인하여야 합니다.
회사가 제공하는 AI 브리핑은 자동화된 알고리즘에 의해 생성되므로 오류나 부정확한 내용이 포함될 수 있으며, 이는 회사의 공식적 견해나 법률·행정·재정 자문이 아닙니다.`,
      },
      {
        title: '제10조 (서비스의 변경 및 중단)',
        content: `회사는 운영상·기술상의 필요에 따라 제공하는 서비스의 전부 또는 일부를 변경할 수 있으며, 변경 시 사전에 공지합니다.
회사는 다음 각 호의 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다.
컴퓨터 등 정보통신설비의 보수점검·교체·고장, 통신두절 등의 사유가 발생한 경우
외부 출처의 정책 변경, 서비스 종료 등으로 정보 제공이 불가능한 경우
천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우
회사는 서비스 중단의 경우 제3조에 정한 방법으로 이용자에게 통지합니다. 다만, 회사가 통제할 수 없는 사유로 인한 중단으로 사전 통지가 불가능한 경우에는 사후에 통지할 수 있습니다.`,
      },
      {
        title: '제11조 (정보의 제공 및 광고 게재)',
        content: `회사는 서비스 운영과 관련하여 서비스 화면, 이메일 등에 광고를 게재할 수 있습니다.
회사가 전송하는 영리목적의 광고성 정보 수신에 대해서는 이용자의 사전 동의를 받으며, 「정보통신망법」 제50조에 따라 이용자가 수신을 거부할 수 있도록 합니다.`,
      },
    ],
  },
  {
    chapter: '제 4장 권리와 의무',
    articles: [
      {
        title: '제12조 (회사의 의무)',
        content: `회사는 관련 법령과 본 약관이 금지하는 행위를 하지 않으며, 지속적이고 안정적으로 서비스를 제공하기 위하여 노력합니다.
회사는 이용자의 개인정보 보호를 위하여 「개인정보 보호법」 등 관련 법령을 준수하고, 별도의 개인정보처리방침을 수립·공개합니다.
회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나 불만이 정당하다고 인정할 경우 이를 처리하여야 하며, 처리 과정 및 결과를 이용자에게 전달합니다.`,
      },
      {
        title: '제13조 (이용자의 의무)',
        content: `이용자는 다음 행위를 하여서는 안 됩니다.
신청 또는 변경 시 허위 내용의 등록
타인의 정보 도용
회사가 게시한 정보의 변경
회사 및 제3자의 저작권 등 지적재산권에 대한 침해
회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위
외설 또는 폭력적인 정보 등 공서양속에 반하는 정보를 공개 또는 게시하는 행위
회사의 동의 없이 영리를 목적으로 서비스를 사용하는 행위
자동화된 수단(봇, 스크래퍼, 크롤러 등)을 이용하여 서비스 및 콘텐츠를 무단으로 수집·복제하는 행위
서비스의 안정적 운영을 방해할 수 있는 정보를 전송하거나 과도한 트래픽을 유발하는 행위
기타 불법적이거나 부당한 행위
이용자는 관련 법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 회사가 공지한 사항을 준수하여야 합니다.`,
      },
      {
        title: '제14조 (저작권 및 콘텐츠의 귀속)',
        content: `회사가 작성한 콘텐츠(AI 요약·브리핑 결과물, 태그, 편집·배열·구성물 등)에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.
외부 출처의 원저작물에 대한 저작권은 해당 원저작자에게 있으며, 회사는 「저작권법」 제28조(공표된 저작물의 인용) 등 관련 규정에 따라 정당한 범위에서 출처를 명시하고 원문 링크(아웃링크)를 제공하는 방식으로 정보를 가공·제공합니다.
이용자는 회사의 사전 승낙 없이 서비스를 통해 얻은 콘텐츠를 복제, 전송, 출판, 배포, 방송 기타 방법으로 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
외부 출처의 원저작자 또는 권리자는 자신의 저작물이 회사 서비스에 포함되는 것을 원하지 않을 경우 해당 연락처를 통해 삭제를 요청할 수 있으며, 회사는 정당한 요청에 대해 지체 없이 조치합니다.`,
      },
    ],
  },
  {
    chapter: '제 5장 계약 해지 및 이용 제한',
    articles: [
      {
        title: '제15조 (계약 해지 및 회원 탈퇴)',
        content: `회원은 언제든지 서비스 내 회원 탈퇴 기능 또는 고객센터를 통하여 이용계약 해지를 신청할 수 있으며, 회사는 관련 법령이 정하는 바에 따라 이를 즉시 처리합니다.
회원 탈퇴 시 회사는 「개인정보 보호법」 및 개인정보처리방침에 따라 회원의 개인정보를 파기합니다. 다만, 관련 법령에 따라 보존할 의무가 있는 정보는 해당 기간 동안 보관합니다.`,
      },
      {
        title: '제16조 (이용 제한 등)',
        content: `회사는 이용자가 본 약관 제13조의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고·일시정지·영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
회사는 본 조에 따른 이용제한의 사유·범위 및 이의신청 방법 등을 이용자에게 통지합니다.`,
      },
    ],
  },
  {
    chapter: '제 6장 손해배상 및 면책',
    articles: [
      {
        title: '제17조 (손해배상)',
        content: `회사 또는 이용자가 본 약관을 위반하여 상대방에게 손해를 입힌 경우, 그 손해를 배상할 책임이 있습니다. 다만, 고의 또는 과실이 없는 경우에는 그러하지 아니합니다.
이용자가 서비스를 이용함에 있어 행한 불법행위나 본 약관 위반행위로 인하여 회사가 제3자로부터 손해배상 청구 또는 소송을 비롯한 각종 이의제기를 받는 경우, 해당 이용자는 자신의 책임과 비용으로 회사를 면책시켜야 합니다.`,
      },
      {
        title: '제18조 (면책조항)',
        content: `회사는 천재지변, 불가항력, 외부 출처의 정책 변경 또는 서비스 종료 등 회사의 합리적인 통제를 벗어난 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
회사는 제9조에 따라 외부 공개 정보를 큐레이션하여 제공하는 것이므로, 해당 정보의 정확성·신뢰성·최신성으로 인하여 발생한 이용자의 손해에 대하여 책임을 지지 않습니다. 단, 회사의 고의 또는 중대한 과실이 있는 경우에는 그러하지 아니합니다.
회사는 이용자가 서비스의 정보에 의존하여 내린 의사결정(체류 국가·도시 선택, 비자 신청, 재정 계획 등) 및 그 결과에 대하여 책임을 지지 않습니다.
회사는 이용자 상호 간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대하여 개입할 의무가 없으며 이로 인한 손해를 배상할 책임이 없습니다.
회사는 무료로 제공되는 서비스 이용과 관련하여 관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.`,
      },
    ],
  },
  {
    chapter: '제 7장 기타',
    articles: [
      {
        title: '제19조 (준거법 및 재판관할)',
        content: `회사와 이용자 간 제기된 소송은 대한민국 법을 준거법으로 합니다.
회사와 이용자 간 발생한 분쟁에 관한 소송은 「민사소송법」상의 관할법원에 제소합니다.`,
      },
      {
        title: '제20조 (분쟁의 해결)',
        content: `회사는 이용자로부터 제출되는 불만사항 및 의견을 우선적으로 처리합니다. 회사와 이용자 간 발생한 전자상거래 분쟁과 관련하여 이용자는 한국소비자원, 콘텐츠분쟁조정위원회, 개인정보 분쟁조정위원회 등의 분쟁조정기관에 분쟁조정을 신청할 수 있습니다.`,
      },
    ],
  },
];

const ARTICLE_TITLE_STYLE: React.CSSProperties = {
  color: '#404959',
  fontFamily: 'Pretendard Variable',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.28px',
  alignSelf: 'stretch',
  whiteSpace: 'pre-line',
};

const ARTICLE_BODY_STYLE: React.CSSProperties = {
  color: '#404959',
  fontFamily: 'Pretendard Variable',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '150%',
  letterSpacing: '-0.28px',
  alignSelf: 'stretch',
  whiteSpace: 'pre-line',
};

const CHAPTER_TITLE_STYLE: React.CSSProperties = {
  color: '#15181D',
  fontFamily: 'Pretendard Variable',
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.36px',
  alignSelf: 'stretch',
};

function TermsContent() {
  return (
    <div className="flex flex-col items-start w-[1064px]" style={{ gap: '56px' }}>
      {/* Chapters */}
      <div className="flex flex-col items-start self-stretch" style={{ gap: '74px' }}>
        {TERMS_CHAPTERS.map((chapter) => (
          <div key={chapter.chapter} className="flex flex-col items-start self-stretch" style={{ gap: '30px' }}>
            <span style={CHAPTER_TITLE_STYLE}>{chapter.chapter}</span>
            <div className="flex flex-col items-start self-stretch" style={{ gap: '24px' }}>
              {chapter.articles.map((article) => (
                <div key={article.title} className="flex flex-col items-start self-stretch" style={{ gap: '6px' }}>
                  <span style={ARTICLE_TITLE_STYLE}>{article.title}</span>
                  <span style={ARTICLE_BODY_STYLE}>{article.content}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 부칙 */}
      <div className="flex flex-col items-start" style={{ width: '256px', gap: '4px' }}>
        <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.32px' }}>
          부칙
        </span>
        <div className="flex items-center" style={{ gap: '2px', alignSelf: 'stretch' }}>
          <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.28px' }}>
            본 약관은
          </span>
          <div className="flex items-center">
            <div className="flex items-center" style={{ gap: '2px' }}>
              <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.28px' }}>
                2026년
              </span>
              <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.28px' }}>
                00월
              </span>
              <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.28px' }}>
                00일
              </span>
            </div>
          </div>
          <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 500, lineHeight: '140%', letterSpacing: '-0.28px' }}>
            부터 시행합니다.
          </span>
        </div>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="flex flex-col items-start w-[1064px]" style={{ gap: '56px' }}>
      <p style={{ ...ARTICLE_BODY_STYLE, color: '#94A0B4' }}>개인정보 처리방침 내용이 여기에 표시됩니다.</p>
    </div>
  );
}

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('terms');

  const isTerms = activeTab === 'terms';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex flex-col items-center pt-10 pb-20 gap-10">

        {/* title */}
        <div className="inline-flex items-center self-start pl-[188px]" style={{ height: '30px', gap: '20px' }}>
          <button
            type="button"
            className="flex justify-center items-center flex-shrink-0"
            style={{ width: '28px', height: '28px' }}
            aria-label="뒤로가기"
          >
            <img src={leftArrowIcon} alt="뒤로가기" style={{ width: '17px', height: '17px', flexShrink: 0 }} />
          </button>
          <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '22px', fontWeight: 600, lineHeight: '140%', letterSpacing: '-0.66px' }}>
            이용약관 및 정책
          </span>
        </div>

        {/* L_Category_Tab */}
        <div className="flex items-center" style={{ width: '1062px' }}>
          {/* 이용약관 탭 */}
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className="flex justify-center items-center flex-shrink-0"
            style={{
              width: '531px',
              padding: '15px 149px',
              borderRadius: '16px 0 0 16px',
              border: isTerms
                ? '1px solid #0085FF'
                : '1px solid #CFD3DA',
              background: isTerms ? '#E5F3FF' : '#FFF',
              transition: 'background 0.15s, border 0.15s',
            }}
          >
            <span style={{
              color: isTerms ? '#0085FF' : '#6B7A94',
              fontFamily: 'Pretendard Variable',
              fontSize: '16px',
              fontWeight: isTerms ? 600 : 400,
              lineHeight: '140%',
              letterSpacing: '-0.32px',
            }}>
              이용약관
            </span>
          </button>

          {/* 개인정보 처리방침 탭 */}
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className="flex justify-center items-center flex-shrink-0"
            style={{
              width: '531px',
              padding: '15px 120px',
              borderRadius: '0 16px 16px 0',
              borderTop: !isTerms ? '1px solid #0085FF' : '1px solid #CFD3DA',
              borderRight: !isTerms ? '1px solid #0085FF' : '1px solid #CFD3DA',
              borderBottom: !isTerms ? '1px solid #0085FF' : '1px solid #CFD3DA',
              background: !isTerms ? '#E5F3FF' : '#FFF',
              transition: 'background 0.15s, border 0.15s',
            }}
          >
            <span style={{
              color: !isTerms ? '#0085FF' : '#6B7A94',
              fontFamily: 'Pretendard Variable',
              fontSize: '16px',
              fontWeight: !isTerms ? 600 : 400,
              lineHeight: '140%',
              letterSpacing: '-0.32px',
            }}>
              개인정보 처리방침
            </span>
          </button>
        </div>

        {/* Content */}
        {isTerms ? <TermsContent /> : <PrivacyContent />}
      </div>

      <Footer />
    </div>
  );
}
