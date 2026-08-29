import { Calendar, Phone, Mail, MapPin, Clock, CheckCircle, DollarSign, FileText, Download, Send, Image, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Booking } from '../lib/supabase';
import { useState } from 'react';

interface BookingCardProps {
  booking: Booking;
  onStatusChange: (bookingId: string, newStatus: Booking['status']) => void;
  onOpenPaymentModal: (booking: Booking) => void;
  onMarkAsPaidCash: (bookingId: string) => void;
  onMarkAsPaidCard: (bookingId: string) => void;
  onRefundDeposit: (bookingId: string, fullOrPartial: 'full' | 'partial') => void;
  refundingDepositId: string | null;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string, notes: string) => void;
}

export function BookingCard({
  booking,
  onStatusChange,
  onOpenPaymentModal,
  onMarkAsPaidCash,
  onMarkAsPaidCard,
  onRefundDeposit,
  refundingDepositId,
  onApprove,
  onReject,
}: BookingCardProps) {
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const junkPhotoUrls = booking.junk_photo_urls as string[] | null;


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'awaiting_approval':
        return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
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
      className={`bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 border-l-4 ${
        booking.status === 'overdue' ? 'border-red-600 bg-red-50' : 'border-green-600'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 break-words">{booking.customer_name}</h3>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              {new Date(booking.created_at).toLocaleDateString()}
            </span>
            <span className="font-semibold text-green-600">
              Junk Removal
            </span>
          </div>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          {booking.total_price && Number(booking.total_price) > 0 && (
            <div className="text-xl sm:text-2xl font-bold text-green-600">${booking.total_price}</div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-start sm:items-center gap-2 text-gray-700 text-sm">
            <Phone className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <a
              href={`tel:${booking.customer_phone}`}
              className="hover:text-green-600 font-semibold break-all"
            >
              {booking.customer_phone}
            </a>
          </div>

          <div className="flex items-start sm:items-center gap-2 text-gray-700 text-sm">
            <Mail className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <a href={`mailto:${booking.customer_email}`} className="hover:text-green-600 break-all">
              {booking.customer_email}
            </a>
          </div>
          <div className="flex items-start gap-2 text-gray-700 text-sm">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <span className="break-words">{booking.delivery_address}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start sm:items-center gap-2 text-gray-700 text-sm">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="break-words">
              {new Date(booking.start_date).toLocaleDateString()}
              {booking.end_date && ` - ${new Date(booking.end_date).toLocaleDateString()}`}
            </span>
          </div>
          {booking.delivery_required && (
            <div className="text-xs sm:text-sm text-gray-600">
              <CheckCircle className="inline h-4 w-4 text-green-600 mr-1" />
              Delivery required
            </div>
          )}
          {booking.notes && (
            <div className="text-xs sm:text-sm text-gray-600 break-words">
              <strong>Notes:</strong> {booking.notes}
            </div>
          )}
        </div>
      </div>

      {junkPhotoUrls && junkPhotoUrls.length > 0 && (
        <div className="mb-4 pb-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Image className="h-5 w-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Customer Photos ({junkPhotoUrls.length})</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {junkPhotoUrls.map((url, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => setSelectedPhotoIndex(index)}
              >
                <img
                  src={url}
                  alt={`Junk photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-green-500 transition-all"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold">View</span>
                </div>
              </div>
            ))}
          </div>

          {booking.status === 'awaiting_approval' && onApprove && onReject && (
            <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-3">
                This booking requires your approval. Review the photos and approve or reject.
              </p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => onApprove(booking.id)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Approve & Create Invoice
                </button>
                <button
                  onClick={() => setShowRejectionDialog(true)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          )}

          {booking.approval_notes && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-900 mb-1">Rejection Reason:</p>
              <p className="text-sm text-red-800">{booking.approval_notes}</p>
            </div>
          )}
        </div>
      )}

      {selectedPhotoIndex !== null && junkPhotoUrls && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={junkPhotoUrls[selectedPhotoIndex]}
              alt={`Junk photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-4 right-4 bg-white text-gray-900 rounded-full px-4 py-2 font-semibold hover:bg-gray-100"
            >
              Close
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {junkPhotoUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full ${
                    index === selectedPhotoIndex ? 'bg-white' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showRejectionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Booking</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this booking. The customer will be notified.
            </p>
            <textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="e.g., We cannot accept this type of material, please contact us for alternatives..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRejectionDialog(false);
                  setRejectionNotes('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onReject && rejectionNotes.trim()) {
                    onReject(booking.id, rejectionNotes);
                    setShowRejectionDialog(false);
                    setRejectionNotes('');
                  }
                }}
                disabled={!rejectionNotes.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-3 sm:pt-4 border-t">
        <div className="flex gap-2 mb-3 flex-wrap">
          {booking.payment_status && (
            <span
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold ${
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
            <span className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
              Deposit Refunded: ${booking.deposit_refund_amount?.toFixed(2) || '0.00'}
            </span>
          )}
        </div>


        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Update Booking Status:</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <select
                value={booking.status}
                onChange={(e) => onStatusChange(booking.id, e.target.value as Booking['status'])}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm font-semibold sm:min-w-[200px]"
              >
                <option value="pending">Pending</option>
                <option value="awaiting_approval">Awaiting Approval</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">In Progress</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {booking.status === 'overdue' && (
                <span className="px-2 sm:px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold animate-pulse text-center">
                  Contact Customer ASAP!
                </span>
              )}
            </div>
          </div>

          {booking.payment_status !== 'paid' && booking.status !== 'cancelled' && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Payment Actions:</p>
              <div className="flex gap-2 flex-wrap">
                {booking.service_type === 'junk_removal' && (
                  <button
                    onClick={() => onOpenPaymentModal(booking)}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Create Payment Link</span>
                    <span className="sm:hidden">Payment Link</span>
                  </button>
                )}
                <button
                  onClick={() => onMarkAsPaidCash(booking.id)}
                  className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Mark Paid (Cash)</span>
                  <span className="sm:hidden">Cash</span>
                </button>
                <button
                  onClick={() => onMarkAsPaidCard(booking.id)}
                  className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Mark Paid (Card)</span>
                  <span className="sm:hidden">Card</span>
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onRefundDeposit(booking.id, 'full')}
                    disabled={refundingDepositId === booking.id}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                    Refund Full (${booking.deposit_amount})
                  </button>
                  <button
                    onClick={() => onRefundDeposit(booking.id, 'partial')}
                    disabled={refundingDepositId === booking.id}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
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
