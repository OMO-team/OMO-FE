import ConfirmActionModal from '../../../shared/components/ConfirmActionModal';
import BagIcon from './icons/BagIcon';

type CompleteTaskModalProps = {
  /** 완료하려는 태스크 이름 — 제목과 안내 문구에 그대로 들어간다 */
  taskName: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  /** 완료 요청 중이면 버튼을 막아 중복 호출을 방지 */
  isCompleting?: boolean;
};

/** 서류 없이 완료 처리하는 태스크의 확인 모달 */
export default function CompleteTaskModal({
  taskName,
  onCancel,
  onConfirm,
  isCompleting = false,
}: CompleteTaskModalProps) {
  return (
    <ConfirmActionModal
      tone="primary"
      icon={<BagIcon className="size-[42px] text-primary-500" />}
      title={`${taskName}을 완료하셨나요?`}
      description={['완료 처리하면 해당 할 일이 완료 상태로 변경됩니다.']}
      infoTitle="완료 전 확인해 주세요"
      infoDetail={[
        `${taskName} 신청과 발급이 모두 완료되었는지 확인해 주세요.`,
        '별도로 등록해야 하는 서류는 없습니다.',
      ]}
      cancelLabel="취소"
      confirmLabel="완료하기"
      onCancel={onCancel}
      onConfirm={onConfirm}
      isConfirmDisabled={isCompleting}
    />
  );
}
