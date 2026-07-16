import UploadIcon from './icons/UploadIcon';
import CloudUploadIcon from './icons/CloudUploadIcon';
import DocumentDoneIcon from './icons/DocumentDoneIcon';
import FileClipIcon from './icons/FileClipIcon';
import RemoveIcon from './icons/RemoveIcon';
import type { RequiredDocumentData } from '../types/roadmap';

type RequiredDocumentCardProps = {
  document: RequiredDocumentData;
  onOpenUpload?: () => void;
};

export default function RequiredDocumentCard({ document, onOpenUpload }: RequiredDocumentCardProps) {
  const isDone = document.status === 'done';
  const isProcessing = document.status === 'processing';
  const isPending = document.status === 'pending';

  return (
    <div
      className={`rounded-3 border px-4 pb-4 pt-5 ${
        isDone
          ? 'border-primary-200 bg-primary-50'
          : isProcessing
            ? 'border-primary-200 bg-primary-50'
            : 'border-dashed border-gray-300 bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-2">
        {isDone ? (
          <DocumentDoneIcon className="size-icon-lg shrink-0 text-primary-500" />
        ) : (
          <span
            className={`size-icon-lg shrink-0 rounded-full ${
              isProcessing ? 'border-2 border-primary-500' : 'border-2 border-gray-300'
            }`}
            aria-hidden
          />
        )}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="title-02 text-gray-900">{document.name}</p>
              {document.tag && (
                <span className="body-05 rounded-md bg-primary-100 px-3 py-1 text-primary-500">{document.tag}</span>
              )}
            </div>
            {(isDone || isPending) && (
              <button
                type="button"
                onClick={onOpenUpload}
                aria-label="파일 업로드"
                className="shrink-0 text-primary-300"
              >
                <CloudUploadIcon className="size-icon-md" />
              </button>
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

          {isDone && document.uploadedFiles && document.uploadedFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              {document.uploadedFiles.map((fileName) => (
                <div
                  key={fileName}
                  className="flex h-7.25 items-center justify-between gap-2 rounded-md bg-[#d2eaff] px-2 py-1"
                >
                  <span className="body-03 flex items-center gap-2 truncate text-primary-600">
                    <FileClipIcon className="size-icon-xs shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </span>
                  <RemoveIcon className="size-icon-xs shrink-0 text-primary-600" />
                </div>
              ))}
            </div>
          )}

          {isPending && (
            <button
              type="button"
              onClick={onOpenUpload}
              className="body-05 flex w-fit items-center gap-1 rounded-2 bg-gray-100 px-3 py-1.5 text-gray-600"
            >
              <UploadIcon className="size-icon-xs" />
              파일 업로드
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
