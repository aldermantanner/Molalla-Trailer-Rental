import { useState } from 'react';
import { Mail, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QuickQuoteCaptureProps {
  onContinue: (email: string) => void;
}

export function QuickQuoteCapture({ onContinue }: QuickQuoteCaptureProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await supabase.from('email_captures').insert({
        email: email,
        source: 'booking_form',
        captured_at: new Date().toISOString()
      });

      localStorage.setItem('userEmail', email);
      onContinue(email);
    } catch (err) {
      console.error('Error saving email:', err);
      onContinue(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-8 mb-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Get Your Quote Instantly!
        </h3>
        <p className="text-gray-600 mb-6">
          Enter your email to save your booking and receive instant pricing updates
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </form>

        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="font-bold text-green-600">✓</div>
            <div className="text-gray-700">Save Progress</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="font-bold text-green-600">✓</div>
            <div className="text-gray-700">Price Alerts</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="font-bold text-green-600">✓</div>
            <div className="text-gray-700">No Spam</div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe anytime. See our privacy policy.
        </p>
      </div>
    </div>
  );
}
