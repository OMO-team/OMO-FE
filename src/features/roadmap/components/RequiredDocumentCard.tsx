import { useState } from 'react';
import UploadIcon from './icons/UploadIcon';
import CloudUploadIcon from './icons/CloudUploadIcon';
import CameraIcon from './icons/CameraIcon';
import UploadSpinnerIcon from './icons/UploadSpinnerIcon';
import DocumentDoneIcon from './icons/DocumentDoneIcon';
import FileClipIcon from './icons/FileClipIcon';
import RemoveIcon from './icons/RemoveIcon';
import ScanFailIcon from './icons/ScanFailIcon';
import type { RequiredDocumentData } from '../types/roadmap';

type ScanFailure = 'blurry' | 'wrong-document';
type ScanState = 'idle' | 'scanning' | ScanFailure;

/** 실제 카메라/OCR 없이 촬영-인식을 흉내내는 클라이언트 시뮬레이션 (F-603) */
function simulateScanOutcome(): 'success' | ScanFailure {
  const roll = Math.random();
  if (roll < 0.7) return 'success';
  if (roll < 0.85) return 'blurry';
  return 'wrong-document';
}

const SCAN_FAILURE_MESSAGE: Record<ScanFailure, string> = {
  blurry: '이미지가 흐려서 인식하지 못했어요. 다시 촬영해 주세요.',
  'wrong-document': '다른 서류로 인식됐어요. 서류를 다시 확인해 주세요.',
};

type RequiredDocumentCardProps = {
  document: RequiredDocumentData;
  onOpenUpload?: () => void;
  /** 촬영 시뮬레이션 성공 또는 실패 후 수동 체크 선택 시 호출 — 서류 완료 체크 API 재사용 */
  onCheck?: () => void;
  /** 스캔 결과 판정 함수 — 기본값은 클라이언트 시뮬레이션, 실제 OCR 연동 시 이 prop만 교체하면 됨 */
  scanFn?: () => 'success' | ScanFailure;
};

export default function RequiredDocumentCard({ document, onOpenUpload, onCheck, scanFn = simulateScanOutcome }: RequiredDocumentCardProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');

  const isDone = document.isChecked;
  const isProcessing = !isDone && document.isProcessing;
  const isPending = !isDone && !isProcessing;

  const handleScan = () => {
    if (scanState === 'scanning') return; // 중복 스캔 방지
    setScanState('scanning');
    setTimeout(() => {
      const outcome = scanFn();
      if (outcome === 'success') {
        setScanState('idle');
        onCheck?.();
      } else {
        setScanState(outcome);
      }
    }, 1500);
  };

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
              {document.ocrSupport && (
                <span className="body-05 rounded-md bg-primary-100 px-3 py-1 text-primary-500">OCR 지원</span>
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
          {document.subtitle && <p className="body-03 text-gray-500">{document.subtitle}</p>}

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

          {isPending && scanState === 'idle' && (
            <div className="flex items-center gap-2">
              {document.ocrSupport && (
                <button
                  type="button"
                  onClick={handleScan}
                  className="body-05 flex w-fit items-center gap-1 rounded-2 bg-primary-100 px-3 py-1.5 text-primary-600"
                >
                  <CameraIcon className="size-icon-xs" />
                  촬영하여 자동 체크
                </button>
              )}
              <button
                type="button"
                onClick={onOpenUpload}
                className="body-05 flex w-fit items-center gap-1 rounded-2 bg-gray-100 px-3 py-1.5 text-gray-600"
              >
                <UploadIcon className="size-icon-xs" />
                파일 업로드
              </button>
            </div>
          )}

          {scanState === 'scanning' && (
            <p className="body-05 flex items-center gap-1 text-primary-600">
              <UploadSpinnerIcon className="size-icon-xs" />
              스캔 중이에요...
            </p>
          )}

          {(scanState === 'blurry' || scanState === 'wrong-document') && (
            <div className="flex flex-col gap-2 rounded-2 bg-white p-3">
              <p className="body-05 flex items-center gap-1 text-red-500">
                <ScanFailIcon className="size-icon-xs" />
                {SCAN_FAILURE_MESSAGE[scanState]}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleScan}
                  className="body-05 rounded-2 bg-primary-100 px-3 py-1.5 text-primary-600"
                >
                  다시 촬영
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScanState('idle');
                    onCheck?.();
                  }}
                  className="body-05 rounded-2 bg-gray-100 px-3 py-1.5 text-gray-600"
                >
                  직접 체크
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
