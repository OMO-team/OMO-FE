import closeIcon from '../../assets/icons/close.png';

type RequiredDocument = {
  name: string;
  subtitle: string;
  status: 'done' | 'processing';
  tag?: string;
  scanStatus?: string;
  scanProgressPercent?: number;
  scanDetail?: string;
};

type DocumentTaskDetailModalProps = {
  category: string;
  title: string;
  infoBanner: string;
  completedCount: number;
  totalCount: number;
  documents: RequiredDocument[];
  onClose?: () => void;
};

function RequiredDocumentCard({ document }: { document: RequiredDocument }) {
  const isProcessing = document.status === 'processing';
  return (
    <div
      className={`rounded-3 border p-4 ${
        isProcessing ? 'border-primary-200 bg-primary-50' : 'border-gray-100 bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`size-icon-lg shrink-0 rounded-full ${
            isProcessing ? 'border-2 border-primary-500' : 'bg-gray-300'
          }`}
          aria-hidden
        />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className={`title-02 text-gray-900 ${isProcessing ? '' : 'line-through'}`}>{document.name}</p>
            {document.tag && (
              <span className="body-05 rounded-md bg-primary-100 px-3 py-1 text-primary-500">{document.tag}</span>
            )}
          </div>
          <p className="body-03 text-gray-500">{document.subtitle}</p>

          {isProcessing && (
            <div className="flex flex-col gap-2">
              <p className="title-03 text-primary-600">{document.scanStatus}</p>
              <div className="h-1 overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-500"
                  style={{ width: `${document.scanProgressPercent ?? 0}%` }}
                />
              </div>
              <p className="body-05 flex gap-1 text-gray-500">{document.scanDetail}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DocumentTaskDetailModal({
  category,
  title,
  infoBanner,
  completedCount,
  totalCount,
  documents,
  onClose,
}: DocumentTaskDetailModalProps) {
  const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div className="flex w-[800px] flex-col gap-[46px] rounded-5 bg-white px-11 pb-[60px] pt-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <span className="body-05 self-start rounded-md bg-primary-50 px-3 py-1 text-primary-700">
              {category}
            </span>
            <p className="heading-04 text-black">{title}</p>
          </div>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full"
            onClick={onClose}
            aria-label="닫기"
          >
            <img src={closeIcon} alt="" className="size-icon-md" />
          </button>
        </div>
        <hr className="border-gray-100" />
        <div className="body-03 rounded-3 border border-primary-100 bg-primary-50 px-10 py-5 text-primary-500">
          {infoBanner}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="title-01 flex items-center justify-between">
          <p className="heading-06 text-black">서류 목록</p>
          <span className="title-02 text-primary-500">
            {completedCount}/{totalCount} 완료
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-primary-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {documents.map((document) => (
          <RequiredDocumentCard key={document.name} document={document} />
        ))}
      </div>
    </div>
  );
}
