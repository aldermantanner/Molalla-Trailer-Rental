import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { AdminPage } from './pages/AdminPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { AdCampaignPage } from './pages/AdCampaignPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ad" element={<AdCampaignPage />} />
        <Route path="/success" element={<PaymentSuccessPage />} />
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
        <Route path="/mybookings" element={<Layout><CustomerPortalPage /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
