import { Calendar, Phone, Mail, MapPin, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { Booking } from '../lib/supabase';

interface BookingCardProps {
  booking: Booking;
  onStatusChange: (bookingId: string, newStatus: Booking['status']) => void;
  onOpenPaymentModal: (booking: Booking) => void;
  onMarkAsPaidCash: (bookingId: string) => void;
  onMarkAsPaidCard: (bookingId: string) => void;
  onRefundDeposit: (bookingId: string, fullOrPartial: 'full' | 'partial') => void;
  refundingDepositId: string | null;
}

export function BookingCard({
  booking,
  onStatusChange,
  onOpenPaymentModal,
  onMarkAsPaidCash,
  onMarkAsPaidCard,
  onRefundDeposit,
  refundingDepositId,
}: BookingCardProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
        booking.status === 'overdue' ? 'border-red-600 bg-red-50' : 'border-green-600'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-slate-800">{booking.customer_name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                booking.status
              )}`}
            >
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
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="h-4 w-4 text-gray-500" />
            <a
              href={`tel:${booking.customer_phone}`}
              className="hover:text-green-600 font-semibold"
            >
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

      <div className="pt-4 border-t">
        <div className="flex gap-2 mb-3 flex-wrap">
          {booking.payment_status && (
            <span
              className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                booking.payment_status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : booking.payment_status === 'refunded'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              Payment: {booking.payment_status.toUpperCase()}
            </span>
          )}
          {booking.deposit_refunded && (
            <span className="px-3 py-2 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
              Deposit Refunded: ${booking.deposit_refund_amount?.toFixed(2) || '0.00'}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Update Booking Status:</p>
            <div className="flex items-center gap-3">
              <select
                value={booking.status}
                onChange={(e) => onStatusChange(booking.id, e.target.value as Booking['status'])}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm font-semibold min-w-[200px]"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active Rental</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {booking.status === 'overdue' && (
                <span className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold animate-pulse">
                  Contact Customer ASAP!
                </span>
              )}
            </div>
          </div>

          {booking.payment_status !== 'paid' && booking.status !== 'cancelled' && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Payment Actions:</p>
              <div className="flex gap-2 flex-wrap">
                {(booking.service_type === 'junk_removal' ||
                  booking.service_type === 'material_delivery') && (
                  <button
                    onClick={() => onOpenPaymentModal(booking)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Create Payment Link
                  </button>
                )}
                <button
                  onClick={() => onMarkAsPaidCash(booking.id)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark Paid (Cash)
                </button>
                <button
                  onClick={() => onMarkAsPaidCard(booking.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark Paid (Card)
                </button>
              </div>
            </div>
          )}

          {booking.status === 'completed' &&
            booking.payment_status === 'paid' &&
            booking.deposit_amount &&
            !booking.deposit_refunded && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Deposit Refund:</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onRefundDeposit(booking.id, 'full')}
                    disabled={refundingDepositId === booking.id}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Refund Full (${booking.deposit_amount})
                  </button>
                  <button
                    onClick={() => onRefundDeposit(booking.id, 'partial')}
                    disabled={refundingDepositId === booking.id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Refund Half (${(booking.deposit_amount / 2).toFixed(2)})
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
