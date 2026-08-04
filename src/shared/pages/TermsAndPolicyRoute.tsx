import { useLocation, useNavigate } from 'react-router-dom';
import TermsAndPolicyPage from './TermsAndPolicyPage';

export type TermsAndPolicyLocationState = {
  fromSignup?: boolean;
  initialTab?: number;
};

export default function TermsAndPolicyRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TermsAndPolicyLocationState | null;

  const handleBack = () => {
    /** location.key === 'default'면 이 세션에서 뒤로 갈 히스토리가 없다는 뜻 (직접 URL 진입/새로고침) */
    if (location.key === 'default') {
      navigate('/', { replace: true });
    } else {
      navigate(-1);
    }
  };

  return <TermsAndPolicyPage onBack={handleBack} initialTab={state?.initialTab} />;
}
