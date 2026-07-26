import { useNavigate } from 'react-router-dom';
import TermsAndPolicyPage from './TermsAndPolicyPage';

export default function TermsAndPolicyRoute() {
  const navigate = useNavigate();
  return <TermsAndPolicyPage onBack={() => navigate(-1)} />;
}
