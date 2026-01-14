import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ToastProvider } from './components/Toast';

const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const CustomerPortalPage = lazy(() => import('./pages/CustomerPortalPage').then(m => ({ default: m.CustomerPortalPage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const AdCampaignPage = lazy(() => import('./pages/AdCampaignPage').then(m => ({ default: m.AdCampaignPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const AvailabilityPage = lazy(() => import('./pages/AvailabilityPage').then(m => ({ default: m.AvailabilityPage })));
const SpecificationsPage = lazy(() => import('./pages/SpecificationsPage').then(m => ({ default: m.SpecificationsPage })));
const JunkRemovalPricingPage = lazy(() => import('./pages/JunkRemovalPricingPage').then(m => ({ default: m.JunkRemovalPricingPage })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

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
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/ad" element={<AdCampaignPage />} />
              <Route path="/success" element={<PaymentSuccessPage />} />
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
              <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
              <Route path="/availability" element={<Layout><AvailabilityPage /></Layout>} />
              <Route path="/specifications" element={<Layout><SpecificationsPage /></Layout>} />
              <Route path="/junk-removal-pricing" element={<Layout><JunkRemovalPricingPage /></Layout>} />
              <Route path="/mybookings" element={<Layout><CustomerPortalPage /></Layout>} />
              <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
