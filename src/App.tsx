import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ToastProvider } from './components/Toast';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const CustomerPortalPage = lazy(() => import('./pages/CustomerPortalPage').then(m => ({ default: m.CustomerPortalPage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const AdCampaignPage = lazy(() => import('./pages/AdCampaignPage').then(m => ({ default: m.AdCampaignPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage').then(m => ({ default: m.TermsAndConditionsPage })));

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
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/ad" element={<AdCampaignPage />} />
              <Route path="/success" element={<PaymentSuccessPage />} />
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
              <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
              <Route path="/junk-removal-pricing" element={<Navigate to="/pricing" replace />} />
              <Route path="/mybookings" element={<Layout><CustomerPortalPage /></Layout>} />
              <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
              <Route path="/privacypolicy" element={<Layout><PrivacyPolicyPage /></Layout>} />
              <Route path="/termsandconditions" element={<Layout><TermsAndConditionsPage /></Layout>} />
              <Route path="/availability" element={<Navigate to="/" replace />} />
              <Route path="/specifications" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
