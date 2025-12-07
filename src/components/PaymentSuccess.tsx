import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function PaymentSuccess() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    setSessionId(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-2xl">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6 text-lg">
          Your booking has been confirmed and your payment has been processed successfully.
        </p>
        <p className="text-gray-600 mb-8">
          We've sent a confirmation email with all the details. We'll contact you shortly to finalize arrangements.
        </p>
        {sessionId && (
          <p className="text-sm text-gray-500 mb-6">
            Reference: {sessionId.slice(-12)}
          </p>
        )}
        <a
          href="/"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
