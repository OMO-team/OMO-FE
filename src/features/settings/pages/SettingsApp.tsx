import { useState } from 'react';
import SettingPage from './SettingPage';
import TermsAndPolicyPage from '../../../shared/pages/TermsAndPolicyPage';

export default function SettingsApp() {
  const [showTerms, setShowTerms] = useState(false);

  if (showTerms) {
    return <TermsAndPolicyPage onBack={() => setShowTerms(false)} />;
  }

  return (
    <SettingPage
      onNavigateToTerms={() => setShowTerms(true)}
      onLogout={() => {}}
      onDeleteAccount={() => {}}
    />
  );
}
