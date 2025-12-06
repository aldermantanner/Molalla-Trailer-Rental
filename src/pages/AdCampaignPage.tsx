import { AdCampaign } from '../components/AdCampaign';
import { useNavigate } from 'react-router-dom';

export function AdCampaignPage() {
  const navigate = useNavigate();

  return <AdCampaign onBookNow={() => navigate('/booking')} />;
}
