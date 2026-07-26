import { useState } from 'react';
import SettingPage from './SettingPage';
import TermsAndPolicyPage from '../../../shared/pages/TermsAndPolicyPage';
import { authApi } from '../../auth/api/authApi';

export default function SettingsApp() {
  const [showTerms, setShowTerms] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // 토큰 만료 등으로 실패해도 로컬 토큰은 이미 제거됨
    }
  };

  if (showTerms) {
    return <TermsAndPolicyPage onBack={() => setShowTerms(false)} />;
  }

  return (
    <SettingPage
      onNavigateToTerms={() => setShowTerms(true)}
      onLogout={handleLogout}
      onDeleteAccount={() => {}}
    />
  );
}
