import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase, type Booking } from '../lib/supabase';
import { AdminDirectBooking } from './AdminDirectBooking';
import { BookingFilters } from './BookingFilters';
import { BookingCard } from './BookingCard';
import { PaymentLinkModal } from './PaymentLinkModal';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './Toast';

type FilterType = 'all' | 'pending' | 'awaiting_approval' | 'confirmed' | 'active' | 'overdue' | 'completed' | 'cancelled';

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [refundingDepositId, setRefundingDepositId] = useState<string | null>(null);
  const [showDirectBooking, setShowDirectBooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmButtonClass?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const { showToast } = useToast();

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
      showToast('Failed to load bookings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const confirmMessages: Record<string, string> = {
      confirmed: `Approve and confirm booking for ${booking.customer_name}?`,
      active: `Mark rental as ACTIVE for ${booking.customer_name}? (Customer currently has the trailer)`,
      overdue: `Mark rental as OVERDUE for ${booking.customer_name}? Customer will be notified.`,
      completed: `Mark booking for ${booking.customer_name} as completed?`,
      cancelled: `Cancel booking for ${booking.customer_name}? This cannot be undone.`,
      pending: `Move booking back to pending?`,
    };

    setConfirmDialog({
      isOpen: true,
      title: 'Update Booking Status',
      message: confirmMessages[newStatus] || 'Update booking status?',
      confirmText: 'Update Status',
      confirmButtonClass:
        newStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700',
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId);

          if (error) throw error;

          showToast(`Booking ${newStatus} successfully!`, 'success');

          try {
            const emailUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-status-notification`;
            await fetch(emailUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                customerEmail: booking.customer_email,
                customerName: booking.customer_name,
                bookingId: booking.id,
                status: newStatus,
                startDate: booking.start_date,
                endDate: booking.end_date,
                totalPrice: booking.total_price,
              }),
            });
          } catch (notifError) {
            console.error('Failed to send email notification:', notifError);
          }

          await fetchBookings();
        } catch (error: any) {
          console.error('Error updating booking:', error);
          showToast(`Failed to update booking: ${error.message || 'Unknown error'}`, 'error');
        }
      },
    });
  };

  const openPaymentModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const refundDeposit = async (bookingId: string, fullOrPartial: 'full' | 'partial') => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || !booking.deposit_amount) return;

    const refundAmount =
      fullOrPartial === 'full' ? booking.deposit_amount : booking.deposit_amount / 2;

    setConfirmDialog({
      isOpen: true,
      title: 'Refund Deposit',
      message: `Refund ${fullOrPartial} deposit of $${refundAmount.toFixed(2)} to ${booking.customer_name}?`,
      confirmText: 'Process Refund',
      confirmButtonClass: 'bg-green-600 hover:bg-green-700',
      onConfirm: async () => {
        setRefundingDepositId(bookingId);

        try {
          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/refund-deposit`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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

          showToast('Deposit refunded successfully!', 'success');
          await fetchBookings();
        } catch (error: any) {
          showToast(error.message || 'Failed to refund deposit', 'error');
        } finally {
          setRefundingDepositId(null);
        }
      },
    });
  };

  const markAsPaidCash = async (bookingId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Mark as Paid',
      message: 'Mark this booking as paid with cash?',
      confirmText: 'Mark as Paid',
      confirmButtonClass: 'bg-emerald-600 hover:bg-emerald-700',
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
            })
            .eq('id', bookingId);

          if (error) throw error;

          showToast('Booking marked as paid (cash)', 'success');
          await fetchBookings();
        } catch (error) {
          console.error('Error marking as paid:', error);
          showToast('Failed to update payment status', 'error');
        }
      },
    });
  };

  const markAsPaidCard = async (bookingId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Mark as Paid',
      message: 'Mark this booking as paid with card?',
      confirmText: 'Mark as Paid',
      confirmButtonClass: 'bg-blue-600 hover:bg-blue-700',
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('bookings')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
            })
            .eq('id', bookingId);

          if (error) throw error;

          showToast('Booking marked as paid (card)', 'success');
          await fetchBookings();
        } catch (error) {
          console.error('Error marking as paid:', error);
          showToast('Failed to update payment status', 'error');
        }
      },
    });
  };

  const approveBooking = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Approve Junk Removal Booking',
      message: `Approve booking for ${booking.customer_name}? The customer will be notified via email.`,
      confirmText: 'Approve Booking',
      confirmButtonClass: 'bg-green-600 hover:bg-green-700',
      onConfirm: async () => {
        try {
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ status: 'pending' })
            .eq('id', bookingId);

          if (updateError) throw updateError;

          showToast('Booking approved successfully!', 'success');
          await fetchBookings();
        } catch (error) {
          console.error('Error approving booking:', error);
          showToast('Failed to approve booking', 'error');
        }
      },
    });
  };

  const rejectBooking = async (bookingId: string, notes: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Reject Junk Removal Booking',
      message: `Reject booking for ${booking.customer_name}? The customer will be notified via email.`,
      confirmText: 'Reject Booking',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('bookings')
            .update({
              status: 'cancelled',
              approval_notes: notes,
            })
            .eq('id', bookingId);

          if (error) throw error;

          const emailUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-status-notification`;
          await fetch(emailUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              customerEmail: booking.customer_email,
              customerName: booking.customer_name,
              bookingId: booking.id,
              status: 'cancelled',
              startDate: booking.start_date,
              rejectionReason: notes,
            }),
          });

          showToast('Booking rejected and customer notified', 'success');
          await fetchBookings();
        } catch (error) {
          console.error('Error rejecting booking:', error);
          showToast('Failed to reject booking', 'error');
        }
      },
    });
  };

  const filteredBookings = bookings
    .filter((b) => filter === 'all' || b.status === filter)
    .filter((b) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        b.customer_name.toLowerCase().includes(query) ||
        b.customer_email.toLowerCase().includes(query) ||
        b.customer_phone.toLowerCase().includes(query) ||
        b.id.toLowerCase().includes(query) ||
        (b.drivers_license_number && b.drivers_license_number.toLowerCase().includes(query))
      );
    });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Manage Bookings</h2>
          <button
            onClick={() => setShowDirectBooking(true)}
            className="bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="whitespace-nowrap">Create Direct Booking</span>
          </button>
        </div>

        <BookingFilters
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          bookings={bookings}
        />
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusChange={updateBookingStatus}
              onOpenPaymentModal={openPaymentModal}
              onMarkAsPaidCash={markAsPaidCash}
              onMarkAsPaidCard={markAsPaidCard}
              onRefundDeposit={refundDeposit}
              refundingDepositId={refundingDepositId}
              onApprove={approveBooking}
              onReject={rejectBooking}
            />
          ))}
        </div>
      )}

      <PaymentLinkModal
        booking={selectedBooking}
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedBooking(null);
        }}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmButtonClass={confirmDialog.confirmButtonClass}
      />

      {showDirectBooking && (
        <AdminDirectBooking
          onClose={() => setShowDirectBooking(false)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
}
