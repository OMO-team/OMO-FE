import { createBrowserRouter } from 'react-router-dom';

// layout
import MainLayout from './shared/layouts/MainLayout';

// home
import HomePage from './features/home/pages/HomePage';

// city-insight
import CityInsight from './features/city-insight/pages/CityInsight';

// roadmap
import RoadmapApp from './features/roadmap/pages/RoadmapApp';
import RoadmapDashboardRoute from './features/roadmap/pages/RoadmapDashboardRoute';
import TaskDetailRoute from './features/roadmap/pages/TaskDetailRoute';

// auth
import EmailVerifyRoute from './features/auth/pages/EmailVerifyRoute';
import PasswordResetVerifyRoute from './features/auth/pages/PasswordResetVerifyRoute';

// shared
import TermsAndPolicyRoute from './shared/pages/TermsAndPolicyRoute';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/city-insight', element: <CityInsight /> },
      { path: '/myhome/empty', element: <RoadmapApp /> },
      { path: '/auth/email-verify', element: <EmailVerifyRoute /> },
      { path: '/auth/password-reset/verify', element: <PasswordResetVerifyRoute /> },
      { path: '/support/terms', element: <TermsAndPolicyRoute /> },
    ],
  },
  {
    path: '/myhome/dashboard/:cityId',
    element: <RoadmapDashboardRoute />,
    children: [{ path: 'task-detail/:taskIndex', element: <TaskDetailRoute /> }],
  },
]);
