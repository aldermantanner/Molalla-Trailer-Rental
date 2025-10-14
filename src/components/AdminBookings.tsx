import { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, MapPin, Clock, CheckCircle, DollarSign, Copy, Check } from 'lucide-react';
import { supabase, type Booking } from '../lib/supabase';

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refundingDepositId, setRefundingDepositId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const openPaymentModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setPaymentAmount(booking.total_price?.toString() || '');
    setPaymentDescription(booking.service_type === 'junk_removal' ? 'Junk Removal Service' : 'Material Delivery Service');
    setShowPaymentModal(true);
    setGeneratedLink('');
    setCopied(false);
  };

  const generatePaymentLink = async () => {
    if (!selectedBooking || !paymentAmount) return;

    setIsGenerating(true);
    try {
      await supabase.auth.getSession();

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-link`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          amount: parseFloat(paymentAmount),
          description: paymentDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment link');
      }

      const { url } = await response.json();
      setGeneratedLink(url);
    } catch (error) {
      console.error('Error generating payment link:', error);
      alert('Failed to generate payment link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refundDeposit = async (bookingId: string, fullOrPartial: 'full' | 'partial') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !booking.deposit_amount) return;

    const refundAmount = fullOrPartial === 'full' ? booking.deposit_amount : booking.deposit_amount / 2;

    if (!confirm(`Refund ${fullOrPartial} deposit of $${refundAmount.toFixed(2)}?`)) {
      return;
    }

    setRefundingDepositId(bookingId);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/refund-deposit`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          bookingId,
          refundAmount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to refund deposit');
      }

      alert('Deposit refunded successfully!');
      await fetchBookings();
    } catch (error: any) {
      alert(error.message || 'Failed to refund deposit');
    } finally {
      setRefundingDepositId(null);
    }
  };

  const markAsPaidCash = async (bookingId: string) => {
    if (!confirm('Mark this booking as paid with cash?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
        })
        .eq('id', bookingId);

      if (error) throw error;

      await fetchBookings();
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert('Failed to update payment status');
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Manage Bookings</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'confirmed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-800">{booking.customer_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-green-600">
                      {booking.service_type === 'rental' ? 'Trailer Rental' : 'Junk Removal'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {booking.service_type === 'rental' && (
                    <div className="text-2xl font-bold text-green-600">${booking.total_price}</div>
                  )}
                  {booking.service_type === 'junk_removal' && (
                    <div className="text-lg font-semibold text-gray-600">Quote Needed</div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${booking.customer_phone}`} className="hover:text-green-600">
                      {booking.customer_phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${booking.customer_email}`} className="hover:text-green-600">
                      {booking.customer_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{booking.delivery_address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {new Date(booking.start_date).toLocaleDateString()}
                      {booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString()}`}
                    </span>
                  </div>
                  {booking.delivery_required && (
                    <div className="text-sm text-gray-600">
                      <CheckCircle className="inline h-4 w-4 text-green-600 mr-1" />
                      Delivery required
                    </div>
                  )}
                  {booking.notes && (
                    <div className="text-sm text-gray-600">
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t flex-wrap">
                {booking.payment_status !== 'paid' && booking.status !== 'cancelled' && (
                  <>
                    {(booking.service_type === 'junk_removal' || booking.service_type === 'material_delivery') && (
                      <button
                        onClick={() => openPaymentModal(booking)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        Create Payment Link
                      </button>
                    )}
                    <button
                      onClick={() => markAsPaidCash(booking.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Paid (Cash)
                    </button>
                  </>
                )}
                {booking.payment_status && (
                  <span className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                    booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    booking.payment_status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Payment: {booking.payment_status.toUpperCase()}
                  </span>
                )}
                {booking.status === 'completed' && booking.payment_status === 'paid' && booking.deposit_amount && !booking.deposit_refunded && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => refundDeposit(booking.id, 'full')}
                      disabled={refundingDepositId === booking.id}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Refund Full Deposit (${booking.deposit_amount})
                    </button>
                    <button
                      onClick={() => refundDeposit(booking.id, 'partial')}
                      disabled={refundingDepositId === booking.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Refund Half Deposit (${(booking.deposit_amount / 2).toFixed(2)})
                    </button>
                  </div>
                )}
                {booking.deposit_refunded && (
                  <span className="px-3 py-2 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
                    Deposit Refunded: ${booking.deposit_refund_amount?.toFixed(2) || '0.00'}
                  </span>
                )}
                <button
                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                  disabled={booking.status === 'confirmed'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                  disabled={booking.status === 'completed'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  Complete
                </button>
                <button
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  disabled={booking.status === 'cancelled'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Generate Payment Link</h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2"><strong>Customer:</strong> {selectedBooking.customer_name}</p>
              <p className="text-gray-600 mb-2"><strong>Email:</strong> {selectedBooking.customer_email}</p>
              <p className="text-gray-600 mb-4"><strong>Service:</strong> {selectedBooking.service_type.replace('_', ' ')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="600.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
                <input
                  type="text"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Junk Removal Service"
                />
              </div>

              {generatedLink && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-800 mb-2">Payment Link Generated!</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Send this link to the customer via email or text</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {!generatedLink && (
                  <button
                    onClick={generatePaymentLink}
                    disabled={!paymentAmount || isGenerating}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 font-semibold"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Link'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBooking(null);
                    setGeneratedLink('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
