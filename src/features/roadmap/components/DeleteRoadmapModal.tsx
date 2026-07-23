import ConfirmActionModal from '../../../shared/components/ConfirmActionModal';

type DeleteRoadmapModalProps = {
  cityName: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function DeleteRoadmapModal({ cityName, onCancel, onConfirm }: DeleteRoadmapModalProps) {
  return (
    <ConfirmActionModal
      title={`${cityName} 로드맵을 삭제할까요?`}
      description={['삭제된 정보는 다시 복구할 수 없어요.']}
      infoTitle="삭제 전 확인해 주세요."
      infoDetail={[
        '로드맵을 삭제하면 지금까지 설정한 일정, 완료한 준비 항목, 예산 계획 정보가 모두 삭제돼요.',
        '계속 진행하려면 삭제하기 버튼을 눌러 주세요.',
      ]}
      cancelLabel="취소"
      confirmLabel="삭제하기"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
