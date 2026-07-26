import { createBrowserRouter } from 'react-router-dom';
import RoadmapApp from './features/roadmap/pages/RoadmapApp';
import RoadmapDashboardRoute from './features/roadmap/pages/RoadmapDashboardRoute';
import TaskDetailRoute from './features/roadmap/pages/TaskDetailRoute';
import TermsAndPolicyRoute from './shared/pages/TermsAndPolicyRoute';
import SettingsApp from './features/settings/pages/SettingsApp';

export const router = createBrowserRouter([
  { path: '/myhome/empty', element: <RoadmapApp /> },
  { path: '/myhome/dashboard/:cityId', element: <RoadmapDashboardRoute /> },
  { path: '/myhome/task-detail', element: <TaskDetailRoute /> },
  { path: '/support/terms', element: <TermsAndPolicyRoute /> },
  { path: '/myhome/setting', element: <SettingsApp /> },
]);
