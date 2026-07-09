import type { RequiredDocumentData } from '../types/roadmap';

type RequiredDocumentCardProps = {
  document: RequiredDocumentData;
};

export default function RequiredDocumentCard({ document }: RequiredDocumentCardProps) {
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
