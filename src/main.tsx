import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as amplitude from '@amplitude/unified';
import Clarity from '@microsoft/clarity';
import './index.css';
import { router } from './router.tsx';

const amplitudeApiKey = import.meta.env.VITE_AMPLITUDE_API_KEY;

if (!amplitudeApiKey) {
  console.warn('Amplitude API key missing — analytics disabled');
} else {
  amplitude.initAll(amplitudeApiKey, {
    analytics: { autocapture: true },
    // 세션 녹화는 Clarity가 전담한다 — 두 도구가 동시에 DOM을 녹화할 이유가 없어 0%로 둔다.
    sessionReplay: { sampleRate: 0 },
  });
  amplitude.track('Viewed Home Page', { prompt_version: 'BA400.4' }); // helps improve this setup flow — safe to remove once you've verified the event lands
}

const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

if (!clarityProjectId) {
  console.warn('Clarity project ID missing — session recording disabled');
} else {
  Clarity.init(clarityProjectId);
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
