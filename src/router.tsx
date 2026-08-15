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
import RequireAuth from './features/auth/components/RequireAuth';
import EmailVerifyRoute from './features/auth/pages/EmailVerifyRoute';
import PasswordResetVerifyRoute from './features/auth/pages/PasswordResetVerifyRoute';
import PasswordResetSuccessRoute from './features/auth/pages/PasswordResetSuccessRoute';
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
      {
        path: '/',
        element: <HomePage />,
        handle: { headerVariant: 'transparent', hasOwnChatEntry: true },
      },
      { path: '/city-insight', element: <CityInsight />, handle: { hasOwnChatEntry: true } },
      { path: '/myhome', element: <RoadmapApp />, handle: { hasOwnChatEntry: true } },
      { path: '/auth/email-verify', element: <EmailVerifyRoute /> },
      { path: '/auth/password-reset/verify', element: <PasswordResetVerifyRoute /> },
      { path: '/auth/password-reset/success', element: <PasswordResetSuccessRoute /> },
      { path: '/oauth/callback', element: <OAuthCallbackRoute /> },
      { path: '/support/terms', element: <TermsAndPolicyRoute /> },
      { path: '/contact', element: <Contact /> },
      {
        path: '/myhome/dashboard/:roadmapId',
        element: (
          <RequireAuth>
            <RoadmapDashboardRoute />
          </RequireAuth>
        ),
        handle: { headerVariant: 'overlay' },
        children: [{ path: 'task-detail/:taskId', element: <TaskDetailRoute /> }],
      },
    ],
  },
  {
    path: '/setting',
    element: (
      <RequireAuth>
        <SettingsApp />
      </RequireAuth>
    ),
  },
  {
    path: '/settings/account',
    element: (
      <RequireAuth>
        <GoogleLinkCallbackRoute />
      </RequireAuth>
    ),
  },
]);
