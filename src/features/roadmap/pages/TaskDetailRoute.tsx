import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import { roadmapDetailByCityId } from '../mocks/mockData';
import type { TaskDetailContext } from './RoadmapDetail';

const apostilleInfoBanner =
  '해외에서 한국 학력을 인정받기 위해 필요한 공증 절차입니다. 외교부 영사민원24를 통해 온라인으로 신청할 수 있습니다.';

export default function TaskDetailRoute() {
  const navigate = useNavigate();
  const { cityId, taskIndex } = useParams<{ cityId: string; taskIndex: string }>();
  const { documents, onCheck, onOpenUpload, onDateClick } = useOutletContext<TaskDetailContext>();

  const tasks = cityId ? roadmapDetailByCityId[cityId]?.tasks : undefined;
  const task = tasks?.[Number(taskIndex)];
  if (!task) return null;

  const closeTaskDetail = () => navigate('..', { preventScrollReset: true });

  return (
    <ModalOverlay onClose={closeTaskDetail}>
      <DocumentTaskDetailModal
        category={task.category}
        title={task.title}
        infoBanner={apostilleInfoBanner}
        dDayLabel={task.dDay ? `D-${task.dDay}` : undefined}
        scheduledDate={task.date}
        onDateClick={onDateClick}
        onClose={closeTaskDetail}
        documents={documents}
        locked={task.status === 'lock'}
        onOpenUpload={onOpenUpload}
        onCheck={onCheck}
      />
    </ModalOverlay>
  );
}
