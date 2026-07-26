import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingPage from './SettingPage';
import TermsAndPolicyPage from '../../../shared/pages/TermsAndPolicyPage';
import PasswordChangeSuccessPage from '../../auth/pages/PasswordChangeSuccessPage';

type View = 'settings' | 'terms' | 'password-success';

export default function SettingsApp() {
  const [view, setView] = useState<View>('settings');
  const navigate = useNavigate();

  if (view === 'terms') {
    return <TermsAndPolicyPage onBack={() => setView('settings')} />;
  }

  if (view === 'password-success') {
    return (
      <PasswordChangeSuccessPage
        onKeepLoggedIn={() => setView('settings')}
        // TODO: 로그인 페이지 라우트가 생기면 그쪽으로 이동
        onLoginAgain={() => navigate('/myhome/empty')}
      />
    );
  }

  return (
    <SettingPage
      onNavigateToTerms={() => setView('terms')}
      onLogout={() => {}}
      onDeleteAccount={() => {}}
      onPasswordChangeSuccess={() => setView('password-success')}
    />
  );
}
