import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// layout (eager — 모든 페이지에서 즉시 필요)
import MainLayout from './shared/layouts/MainLayout';

// auth guard (eager — 소용량 래퍼 컴포넌트)
import RequireAuth from './features/auth/components/RequireAuth';

// fallback
import PageLoader from './shared/components/PageLoader';

// home
const HomePage = lazy(() => import('./features/home/pages/HomePage'));

// city-insight
const CityInsight = lazy(() => import('./features/city-insight/pages/CityInsight'));

// roadmap
const RoadmapApp = lazy(() => import('./features/roadmap/pages/RoadmapApp'));
const RoadmapDashboardRoute = lazy(() => import('./features/roadmap/pages/RoadmapDashboardRoute'));
const TaskDetailRoute = lazy(() => import('./features/roadmap/pages/TaskDetailRoute'));

// auth pages
const EmailVerifyRoute = lazy(() => import('./features/auth/pages/EmailVerifyRoute'));
const PasswordResetVerifyRoute = lazy(() => import('./features/auth/pages/PasswordResetVerifyRoute'));
const PasswordResetSuccessRoute = lazy(() => import('./features/auth/pages/PasswordResetSuccessRoute'));
const OAuthCallbackRoute = lazy(() => import('./features/auth/pages/OAuthCallbackRoute'));
const GoogleLinkCallbackRoute = lazy(() => import('./features/auth/pages/GoogleLinkCallbackRoute'));

// shared pages
const TermsAndPolicyRoute = lazy(() => import('./shared/pages/TermsAndPolicyRoute'));

// settings
const SettingsApp = lazy(() => import('./features/settings/pages/SettingsApp'));

// contact
const Contact = lazy(() => import('./features/contact/pages/Contact'));

const fallback = <PageLoader />;

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Suspense fallback={fallback}><HomePage /></Suspense>,
        handle: { headerVariant: 'transparent', hasOwnChatEntry: true },
      },
      {
        path: '/city-insight',
        element: <Suspense fallback={fallback}><CityInsight /></Suspense>,
        handle: { hasOwnChatEntry: true },
      },
      {
        path: '/myhome',
        element: <Suspense fallback={fallback}><RoadmapApp /></Suspense>,
        handle: { hasOwnChatEntry: true },
      },
      { path: '/auth/email-verify', element: <Suspense fallback={fallback}><EmailVerifyRoute /></Suspense> },
      { path: '/auth/password-reset/verify', element: <Suspense fallback={fallback}><PasswordResetVerifyRoute /></Suspense> },
      { path: '/auth/password-reset/success', element: <Suspense fallback={fallback}><PasswordResetSuccessRoute /></Suspense> },
      { path: '/oauth/callback', element: <Suspense fallback={fallback}><OAuthCallbackRoute /></Suspense> },
      { path: '/support/terms', element: <Suspense fallback={fallback}><TermsAndPolicyRoute /></Suspense> },
      { path: '/contact', element: <Suspense fallback={fallback}><Contact /></Suspense> },
      {
        path: '/myhome/dashboard/:roadmapId',
        element: (
          <RequireAuth>
            <Suspense fallback={fallback}><RoadmapDashboardRoute /></Suspense>
          </RequireAuth>
        ),
        handle: { headerVariant: 'overlay' },
        children: [
          {
            path: 'task-detail/:taskId',
            element: <Suspense fallback={fallback}><TaskDetailRoute /></Suspense>,
          },
        ],
      },
    ],
  },
  {
    path: '/setting',
    element: (
      <RequireAuth>
        <Suspense fallback={fallback}><SettingsApp /></Suspense>
      </RequireAuth>
    ),
  },
  {
    path: '/settings/account',
    element: (
      <RequireAuth>
        <Suspense fallback={fallback}><GoogleLinkCallbackRoute /></Suspense>
      </RequireAuth>
    ),
  },
]);
