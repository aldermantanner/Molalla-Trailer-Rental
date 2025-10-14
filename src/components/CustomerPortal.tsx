import { useState } from 'react';
import { Search, Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [refundingBookingId, setRefundingBookingId] = useState<string | null>(null);
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);

  const searchBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    if (!email && !phone) {
      setError('Please enter either email or phone number');
      setLoading(false);
      return;
    }

    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

    if (email) {
      query = query.eq('customer_email', email.toLowerCase().trim());
    }

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      query = query.eq('customer_phone', cleanPhone);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError('Error fetching bookings. Please try again.');
      console.error(fetchError);
    } else {
      setBookings(data || []);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-700 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'completed':
        return 'text-blue-700 bg-blue-100';
      case 'cancelled':
        return 'text-red-700 bg-red-100';
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
        },
        body: JSON.stringify({ bookingId }),
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
            <Search className="h-10 w-10 text-green-600 mr-3" />
            <h2 className="text-4xl font-bold text-slate-800">Customer Portal</h2>
          </div>
          <p className="text-xl text-gray-600">
            Look up your bookings and view rental history
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={searchBookings} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div className="text-center text-gray-500 font-medium">- OR -</div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="(503) 555-1234"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {refundSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {refundSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search My Bookings
                </>
              )}
            </button>
          </form>
        </div>

        {searched && bookings.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Bookings Found</h3>
            <p className="text-yellow-700">
              We couldn't find any bookings with the provided information. Please check your email or phone number and try again.
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
