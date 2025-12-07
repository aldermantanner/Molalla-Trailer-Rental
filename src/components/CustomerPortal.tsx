import { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  start_date: string;
  end_date: string | null;
  delivery_address: string;
  status: string;
  total_price: number;
  created_at: string;
  trailer_type: string;
  payment_status: string;
  stripe_payment_intent: string;
  refund_amount: number;
}

export function CustomerPortal() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [refundingBookingId, setRefundingBookingId] = useState<string | null>(null);
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'verify' | 'bookings'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sendingCode, setSendingCode] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('customer_session_token');
    const storedEmail = sessionStorage.getItem('customer_email');
    const expiresAt = sessionStorage.getItem('customer_session_expires');

    if (token && storedEmail && expiresAt) {
      const now = Date.now();
      const expirationTime = parseInt(expiresAt);

      if (now < expirationTime) {
        setSessionToken(token);
        setEmail(storedEmail);
        setStep('bookings');
        loadBookings(token, storedEmail);
      } else {
        sessionStorage.clear();
        setStep('email');
      }
    }
  }, []);

  const requestVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingCode(true);
    setError('');

    if (!email) {
      setError('Please enter your email address');
      setSendingCode(false);
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification-email`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      if (data.devMode && data.devCode) {
        setDevCode(data.devCode);
      }

      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-code`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setSessionToken(data.sessionToken);
      const expiresAt = Date.now() + (10 * 60 * 1000);
      sessionStorage.setItem('customer_session_token', data.sessionToken);
      sessionStorage.setItem('customer_email', data.email);
      sessionStorage.setItem('customer_session_expires', expiresAt.toString());
      setStep('bookings');
      await loadBookings(data.sessionToken, data.email);
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (token: string, userEmail: string) => {
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-customer-bookings`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          sessionToken: token,
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load bookings');
      }

      setBookings(data.bookings || []);
    } catch (err: any) {
      setError('Error loading bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('customer_session_token');
    sessionStorage.removeItem('customer_email');
    setSessionToken(null);
    setEmail('');
    setBookings([]);
    setStep('email');
    setSearched(false);
    setVerificationCode('');
    setDevCode(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-700 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'active':
        return 'text-blue-700 bg-blue-100';
      case 'overdue':
        return 'text-red-700 bg-red-100';
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'cancelled':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'active':
        return <CheckCircle className="h-5 w-5" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleRefund = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Refund amount depends on timing:\n\n• More than 24 hours: 100% refund (minus $50 deposit)\n• 12-24 hours: 50% refund (minus $50 deposit)\n• Less than 12 hours: NO REFUND\n\nThe $50 deposit is non-refundable upon cancellation.')) {
      return;
    }

    setRefundingBookingId(bookingId);
    setError('');
    setRefundSuccess(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-refund`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'X-Session-Token': sessionToken || '',
        },
        body: JSON.stringify({ bookingId, sessionToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process refund');
      }

      setRefundSuccess(`Refund processed successfully! $${data.refundAmount.toFixed(2)} will be returned to your card within 5-10 business days.`);

      const updatedBookings = bookings.map(b =>
        b.id === bookingId
          ? { ...b, status: 'cancelled', payment_status: 'refunded', refund_amount: data.refundAmount }
          : b
      );
      setBookings(updatedBookings);
    } catch (err: any) {
      setError(err.message || 'Failed to process refund. Please contact us directly.');
    } finally {
      setRefundingBookingId(null);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-10 w-10 text-green-600 mr-3" />
            <h2 className="text-4xl font-bold text-slate-800">Customer Portal</h2>
          </div>
          <p className="text-xl text-gray-600">
            Secure access to your bookings via email verification
          </p>
        </div>

        {step === 'email' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form onSubmit={requestVerificationCode} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Enter the email address you used when making your booking. We'll send you a verification code.
                </p>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sendingCode}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingCode ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Send Verification Code
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {step === 'verify' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form onSubmit={verifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Enter the 6-digit code we sent to {email}
                </p>
                {devCode && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-3">
                    <strong>Development Mode:</strong> Your code is <strong>{devCode}</strong>
                  </div>
                )}
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setVerificationCode('');
                    setError('');
                    setDevCode(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Verify & View Bookings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'bookings' && (
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Viewing bookings for <strong>{email}</strong>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        )}

        {refundSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {refundSuccess}
          </div>
        )}

        {step === 'bookings' && searched && bookings.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Bookings Found</h3>
            <p className="text-yellow-700">
              We couldn't find any bookings with the provided email address. Please check your email and try again.
            </p>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">Your Bookings</h3>
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-slate-800 mb-1">
                        {booking.service_type === 'rental' ? 'Dump Trailer Rental' : 'Junk Removal Service'}
                      </h4>
                      <p className="text-gray-600">Booking ID: {booking.id.slice(0, 8)}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Rental Period</p>
                        <p className="text-gray-900">
                          {formatDate(booking.start_date)}
                          {booking.end_date && ` - ${formatDate(booking.end_date)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total Price</p>
                        <p className="text-gray-900 font-semibold">${Number(booking.total_price).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-gray-900">{booking.delivery_address}</p>
                      </div>
                    </div>

                    {booking.trailer_type && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Trailer Type</p>
                          <p className="text-gray-900">{booking.trailer_type}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Booked on {formatDate(booking.created_at)}
                    </p>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="bg-green-50 px-6 py-4 border-t border-green-100">
                    <p className="text-green-800 font-medium">
                      Your booking is confirmed! We'll contact you at {booking.customer_phone} with delivery details.
                    </p>
                  </div>
                )}

                {booking.status === 'pending' && (
                  <div className="bg-yellow-50 px-6 py-4 border-t border-yellow-100">
                    <p className="text-yellow-800 font-medium">
                      Your booking is pending confirmation. We'll contact you shortly at {booking.customer_phone}.
                    </p>
                  </div>
                )}

                {booking.status === 'cancelled' && booking.refund_amount && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <p className="text-gray-800 font-medium">
                      Cancelled - ${booking.refund_amount.toFixed(2)} refunded to your card
                    </p>
                  </div>
                )}

                {(booking.status === 'confirmed' || booking.status === 'pending') && booking.payment_status === 'paid' && (
                  <div className="bg-white px-6 py-4 border-t border-gray-200">
                    <button
                      onClick={() => handleRefund(booking.id)}
                      disabled={refundingBookingId === booking.id}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {refundingBookingId === booking.id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5" />
                          Cancel Booking & Request Refund
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Refund amount varies by timing. See rental agreement for details.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
          <p className="text-blue-800 mb-3">
            If you have questions about your booking or need to make changes, please contact us:
          </p>
          <div className="space-y-2 text-blue-900">
            <p>
              <strong>Phone:</strong>{' '}
              <a href="tel:503-500-6121" className="underline hover:text-blue-700">
                503-500-6121
              </a>
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:Molallatrailerrental@outlook.com" className="underline hover:text-blue-700">
                Molallatrailerrental@outlook.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
