import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RoadmapDetail from './RoadmapDetail';

export default function RoadmapDashboardRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roadmapId } = useParams<{ roadmapId: string }>();

  const handleBack = () => {
    /** location.key === 'default'면 이 세션에서 뒤로 갈 히스토리가 없다는 뜻 (직접 URL 진입/새로고침) */
    if (location.key === 'default') {
      navigate('/myhome/empty', { replace: true });
    } else {
      navigate(-1);
    }
  };

  return <RoadmapDetail roadmapId={Number(roadmapId)} onBack={handleBack} />;
}
