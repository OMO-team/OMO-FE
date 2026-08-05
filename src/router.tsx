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
import OAuthCallbackRoute from './features/auth/pages/OAuthCallbackRoute';
import GoogleLinkCallbackRoute from './features/auth/pages/GoogleLinkCallbackRoute';

// shared
import TermsAndPolicyRoute from './shared/pages/TermsAndPolicyRoute';
import SettingsApp from './features/settings/pages/SettingsApp';

// contact
import Contact from './features/contact/pages/Contact';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage />, handle: { headerVariant: 'transparent' } },
      { path: '/city-insight', element: <CityInsight /> },
      { path: '/myhome/empty', element: <RoadmapApp /> },
      { path: '/auth/email-verify', element: <EmailVerifyRoute /> },
      { path: '/auth/password-reset/verify', element: <PasswordResetVerifyRoute /> },
      { path: '/oauth/callback', element: <OAuthCallbackRoute /> },
      { path: '/support/terms', element: <TermsAndPolicyRoute /> },
      { path: '/contact', element: <Contact /> },
      {
        path: '/myhome/dashboard/:roadmapId',
        element: <RoadmapDashboardRoute />,
        handle: { headerVariant: 'overlay' },
        children: [{ path: 'task-detail/:taskId', element: <TaskDetailRoute /> }],
      },
    ],
  },
  { path: '/setting', element: <SettingsApp /> },
  { path: '/settings/account', element: <GoogleLinkCallbackRoute /> },
]);
