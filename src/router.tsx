import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import RoadmapApp from './features/roadmap/pages/RoadmapApp';
import TermsAndPolicyPage from './shared/pages/TermsAndPolicyPage';

function TermsAndPolicyRoute() {
  const navigate = useNavigate();
  return <TermsAndPolicyPage onBack={() => navigate(-1)} />;
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/myhome" replace /> },
  { path: '/myhome', element: <RoadmapApp /> },
  { path: '/support/terms', element: <TermsAndPolicyRoute /> },
]);
