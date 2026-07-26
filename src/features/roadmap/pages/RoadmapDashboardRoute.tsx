import { useNavigate, useParams } from 'react-router-dom';
import RoadmapDetail from './RoadmapDetail';

export default function RoadmapDashboardRoute() {
  const navigate = useNavigate();
  const { cityId } = useParams<{ cityId: string }>();
  return <RoadmapDetail cityId={cityId} onBack={() => navigate(-1)} />;
}
