import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingPage from './SettingPage';
import TermsAndPolicyPage from '../../../shared/pages/TermsAndPolicyPage';
import PasswordChangeSuccessPage from '../../auth/pages/PasswordChangeSuccessPage';
import { authApi } from '../../auth/api/authApi';
import { memberApi } from '../api/memberApi';
import { useAuthStore } from '../../auth/store/useAuthStore';

type View = 'settings' | 'terms' | 'password-success';

export default function SettingsApp() {
  const [view, setView] = useState<View>('settings');
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // 토큰 만료 등으로 실패해도 로컬 토큰은 이미 제거됨
    } finally {
      signOut();
      navigate('/');
    }
  };

  const handleDeleteAccount = async () => {
    await memberApi.withdraw();
    signOut();
    navigate('/');
  };

  if (view === 'terms') {
    return <TermsAndPolicyPage onBack={() => setView('settings')} />;
  }

  if (view === 'password-success') {
    return (
      <PasswordChangeSuccessPage
        onKeepLoggedIn={() => setView('settings')}
        onLoginAgain={() => navigate('/')}
      />
    );
  }

  return (
    <SettingPage
      onNavigateToTerms={() => setView('terms')}
      onLogout={handleLogout}
      onDeleteAccount={handleDeleteAccount}
      onPasswordChangeSuccess={() => setView('password-success')}
    />
  );
}
