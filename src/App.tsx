import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { AdminPage } from './pages/AdminPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { AdCampaignPage } from './pages/AdCampaignPage';
import { PricingPage } from './pages/PricingPage';
import { AvailabilityPage } from './pages/AvailabilityPage';
import { SpecificationsPage } from './pages/SpecificationsPage';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-40">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">{error.message}</pre>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Routes>
          <Route path="/ad" element={<AdCampaignPage />} />
          <Route path="/success" element={<PaymentSuccessPage />} />
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
          <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
          <Route path="/availability" element={<Layout><AvailabilityPage /></Layout>} />
          <Route path="/specifications" element={<Layout><SpecificationsPage /></Layout>} />
          <Route path="/mybookings" element={<Layout><CustomerPortalPage /></Layout>} />
          <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
