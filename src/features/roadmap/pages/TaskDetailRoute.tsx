import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import { berlinRoadmapTasks } from '../mocks/mockData';
import type { TaskDetailContext } from './RoadmapDetail';

const APOSTILLE_INFO_BANNER =
  '해외에서 한국 학력을 인정받기 위해 필요한 공증 절차입니다. 외교부 영사민원24를 통해 온라인으로 신청할 수 있습니다.';

export default function TaskDetailRoute() {
  const navigate = useNavigate();
  const { taskIndex } = useParams<{ taskIndex: string }>();
  const { documents, onCheck, onOpenUpload, onDateClick } = useOutletContext<TaskDetailContext>();

  const task = berlinRoadmapTasks[Number(taskIndex)];
  if (!task) return null;

  return (
    <ModalOverlay onClose={() => navigate(-1)}>
      <DocumentTaskDetailModal
        category={task.category}
        title={task.title}
        infoBanner={APOSTILLE_INFO_BANNER}
        dDayLabel={task.dDay ? `D-${task.dDay}` : undefined}
        scheduledDate={task.date}
        onDateClick={onDateClick}
        onClose={() => navigate(-1)}
        documents={documents}
        locked={task.status === 'lock'}
        onOpenUpload={onOpenUpload}
        onCheck={onCheck}
      />
    </ModalOverlay>
  );
}
