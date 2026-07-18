import { useRef, type ChangeEvent, type DragEvent } from 'react';
import CloudUploadIcon from './icons/CloudUploadIcon';
import FileTypeIcon from './icons/FileTypeIcon';
import UploadSpinnerIcon from './icons/UploadSpinnerIcon';
import RemoveIcon from './icons/RemoveIcon';
import TimelineOngoingIcon from './icons/TimelineOngoingIcon';
import InfoCircleIcon from './icons/InfoCircleIcon';
import type { UploadedFileItem } from '../types/roadmap';

type DocumentUploadModalProps = {
  files: UploadedFileItem[];
  maxSizeMB?: number;
  onSelectFiles?: (files: FileList) => void;
  onRemoveFile?: (name: string) => void;
  onComplete?: () => void;
  onClose?: () => void;
};

export default function DocumentUploadModal({
  files,
  maxSizeMB = 10,
  onSelectFiles,
  onRemoveFile,
  onComplete,
  onClose,
}: DocumentUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onSelectFiles?.(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) onSelectFiles?.(e.dataTransfer.files);
  };

  return (
    <div className="flex w-[480px] flex-col gap-5 rounded-4 border border-gray-200 bg-white p-[30px] shadow-[0px_8px_7px_rgba(6,49,88,0.2)]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white">
            <CloudUploadIcon className="size-icon-md text-gray-700" />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="heading-06 text-gray-900">서류를 업로드해 주세요.</p>
              <button type="button" onClick={onClose} aria-label="닫기" className="text-gray-500">
                <RemoveIcon className="size-icon-md" />
              </button>
            </div>
            <p className="body-03 text-gray-500">PDF, JPG, PNG 파일을 첨부할 수 있어요.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex w-full flex-col items-center gap-5 rounded-4 border border-dashed border-gray-200 px-20 py-11"
          >
            <div className="flex flex-col items-center gap-2">
              <CloudUploadIcon className="size-icon-md text-gray-400" />
              <div className="flex flex-col items-center gap-2">
                <p className="body-02 text-black">필요한 서류를 올려주세요.</p>
                <p className="label-02 text-gray-500">업로드한 문서는 자동으로 스캔되어 진행 상태에 반영돼요.</p>
              </div>
              <span className="label-03 w-full rounded-md bg-gray-20 py-1 text-center text-gray-500">
                PDF, JPG/JPEG, PNG, HEIC, Word · 최대 {maxSizeMB}MB 이하
              </span>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="title-03 rounded-2 bg-gray-100 px-[22px] py-2 text-gray-700"
            >
              파일 업로드하기
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {files.length > 0 && (
            <div className="flex w-full flex-col gap-3">
              {files.map((file) => (
                <div key={file.name} className="flex w-full items-start justify-end rounded-2 border border-gray-100 px-2.5 pb-2.5 pt-2">
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <FileTypeIcon fileName={file.name} className="size-11.5 shrink-0" />
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="body-02 truncate text-gray-900">{file.name}</p>
                        <div className="body-04 flex items-center gap-1 text-gray-500">
                          <span>
                            {file.uploadedSizeMB}MB of {file.totalSizeMB}MB ·
                          </span>
                          {file.status === 'uploading' && (
                            <span className="flex items-center gap-1">
                              <UploadSpinnerIcon className="size-icon-sm" />
                              파일을 업로드하고 있어요
                            </span>
                          )}
                          {file.status === 'processing' && (
                            <span className="flex items-center gap-1 truncate">
                              <UploadSpinnerIcon className="size-icon-sm shrink-0" />
                              <span className="truncate">이미지 분석 중 · AI 텍스트 추출 중</span>
                            </span>
                          )}
                          {file.status === 'completed' && (
                            <span className="flex items-center gap-1">
                              <TimelineOngoingIcon className="size-icon-sm" />
                              문서 스캔이 완료되었어요
                            </span>
                          )}
                          {file.status === 'error' && (
                            <span className="flex items-center gap-1 text-red-300">
                              <InfoCircleIcon className="size-icon-sm rotate-180 text-[#ff2a14]" />
                              파일을 업로드하지 못했어요.
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveFile?.(file.name)}
                        aria-label={`${file.name} 삭제`}
                        className="shrink-0 pr-0.5 pt-0.5 text-gray-400"
                      >
                        <RemoveIcon className="size-icon-xs" />
                      </button>
                    </div>
                    {file.status === 'uploading' && (
                      <div className="h-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-primary-400"
                          style={{ width: `${(file.uploadedSizeMB / file.totalSizeMB) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button type="button" onClick={onComplete} className="title-05 w-full rounded-2 bg-gray-700 py-3 text-white">
        업로드 완료
      </button>
    </div>
  );
}
