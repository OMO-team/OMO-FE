import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingPage from './SettingPage';
import TermsAndPolicyPage from '../../../shared/pages/TermsAndPolicyPage';
import PasswordChangeSuccessPage from '../../auth/pages/PasswordChangeSuccessPage';
import { authApi } from '../../auth/api/authApi';

type View = 'settings' | 'terms' | 'password-success';

export default function SettingsApp() {
  const [view, setView] = useState<View>('settings');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // 토큰 만료 등으로 실패해도 로컬 토큰은 이미 제거됨
    }
  };

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
      onLogout={handleLogout}
      onDeleteAccount={() => {}}
      onPasswordChangeSuccess={() => setView('password-success')}
    />
  );
}
