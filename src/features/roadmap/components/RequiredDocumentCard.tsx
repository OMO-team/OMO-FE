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

/**
 * 카드 색과 아이콘은 서류 체크 여부만이 아니라 태스크의 일정 상태에 따라서도 달라진다.
 * - unscheduled: 일정 추가 전(마감일 없음) — 흰 배경에 제목까지 흐리게
 * - scheduled: 마감일이 아직 남음
 * - today: 오늘이 마감일 — 체크·처리 중이면 파랗게 강조
 * - overdue: 마감일이 지남 — 전체를 회색으로 죽이고 완료된 서류는 취소선
 */
export type DocumentScheduleState = 'unscheduled' | 'scheduled' | 'today' | 'overdue';

type RequiredDocumentCardProps = {
  document: RequiredDocumentData;
  onOpenUpload?: () => void;
  /** 촬영 시뮬레이션 성공 또는 실패 후 수동 체크 선택 시 호출 — 서류 완료 체크 API 재사용 */
  onCheck?: () => void;
  /** 스캔 결과 판정 함수 — 기본값은 클라이언트 시뮬레이션, 실제 OCR 연동 시 이 prop만 교체하면 됨 */
  scanFn?: () => 'success' | ScanFailure;
  /** 속한 태스크의 일정 상태 — 지정하지 않으면 일정이 잡힌 것으로 본다 */
  scheduleState?: DocumentScheduleState;
};

export default function RequiredDocumentCard({
  document,
  onOpenUpload,
  onCheck,
  scanFn = simulateScanOutcome,
  scheduleState = 'scheduled',
}: RequiredDocumentCardProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');

  const isDone = document.isChecked;
  const isProcessing = !isDone && document.isProcessing;
  const isPending = !isDone && !isProcessing;

  const isOverdue = scheduleState === 'overdue';
  const isUnscheduled = scheduleState === 'unscheduled';
  /** 기간이 지나지 않은 상태에서 체크됐거나 처리 중이면 파란 카드로 강조 */
  const isHighlighted = !isOverdue && !isUnscheduled && (isDone || isProcessing);

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
      className={`rounded-3 border px-4 pb-4 pt-5 transition-colors ${
        isOverdue
          ? 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'
          : isHighlighted
            ? // hover 배경(#d2eaff)은 primary-100과 200 사이 값이라 대응하는 토큰이 없어 그대로 씀
              'border-primary-200 bg-primary-50 hover:bg-[#d2eaff]'
            : 'border-gray-100 bg-white hover:bg-gray-20'
      }`}
    >
      <div className="flex items-start gap-2">
        {isDone ? (
          // 완료는 되돌릴 수 없어서 체크된 뒤에는 누를 수 없는 아이콘으로 둔다
          <DocumentDoneIcon
            className={`size-icon-lg shrink-0 ${isOverdue ? 'text-gray-300' : 'text-primary-500'}`}
          />
        ) : (
          // 원을 누르면 서류가 완료로 바뀐다. 기간이 지났어도 체크할 수 있다.
          <button
            type="button"
            onClick={onCheck}
            // 핸들러가 없거나 서버가 문서를 읽는 중이면 누를 수 없다
            disabled={!onCheck || isProcessing}
            aria-label={`${document.name} 완료로 표시`}
            className={`size-icon-lg shrink-0 rounded-full transition-colors disabled:cursor-not-allowed ${
              isProcessing
                ? 'border-2 border-primary-500'
                : // 일정이 잡혔지만 아직 안 한 서류는 테두리 대신 옅은 파란 원으로 표시
                  scheduleState === 'scheduled'
                  ? 'bg-primary-200 not-disabled:hover:bg-primary-300'
                  : 'border-2 border-gray-300 not-disabled:hover:border-primary-500'
            }`}
          />
        )}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p
                className={`title-02 ${isUnscheduled ? 'text-gray-500' : 'text-gray-900'} ${
                  // 기간이 지난 뒤 완료된 서류는 지나간 일이라는 뜻으로 취소선을 긋는다
                  isOverdue && isDone ? 'line-through' : ''
                }`}
              >
                {document.name}
              </p>
              {document.ocrSupport && (
                <span
                  className={`body-05 rounded-md px-3 py-1 ${
                    isOverdue ? 'bg-gray-100 text-gray-500' : 'bg-primary-100 text-primary-500'
                  }`}
                >
                  OCR 지원
                </span>
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
            // 파일 목록만 위 간격이 16px — 카드 세로 간격(8px)에 8px을 더해 맞춘다
            <div className="mt-2 flex flex-col gap-2">
              {document.uploadedFiles.map((fileName) => (
                <div
                  key={fileName}
                  // 파란 칩 배경(#d2eaff)과 hover(#c3e3ff)는 primary-100과 200 사이 값이라 대응하는 토큰이 없어 그대로 씀
                  className={`flex h-7.25 items-center justify-between gap-2 rounded-md px-2 py-1 transition-colors ${
                    isOverdue ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#d2eaff] hover:bg-[#c3e3ff]'
                  }`}
                >
                  <span
                    className={`body-03 flex items-center gap-2 truncate ${
                      isOverdue ? 'text-gray-500' : 'text-primary-600'
                    }`}
                  >
                    <FileClipIcon className="size-icon-sm shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </span>
                  <RemoveIcon
                    className={`size-icon-xs shrink-0 ${isOverdue ? 'text-gray-500' : 'text-primary-600'}`}
                  />
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
