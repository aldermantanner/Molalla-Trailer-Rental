import { MessageSquare } from 'lucide-react';
import { Booking } from '../lib/supabase';

interface SMSTemplatesProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export function SMSTemplates({ booking, isOpen, onClose }: SMSTemplatesProps) {
  if (!isOpen) return null;

  const getSmsTemplate = (status: string) => {
    const firstName = booking.customer_name.split(' ')[0];

    switch (status) {
      case 'pickup_reminder':
        return `Hi ${firstName}, reminder: Your Molalla Trailer pickup is tomorrow! Bring your driver's license. Call 503-500-6121 with questions.`;
      case 'return_reminder':
        return `Hi ${firstName}, reminder: Trailer return due tomorrow by end of day. Need extension? Call 503-500-6121 - Molalla Trailer`;
      case 'overdue':
        return `${firstName}, your trailer rental is OVERDUE. Please return ASAP or call 503-500-6121. Late fees apply. - Molalla Trailer`;
      case 'active':
        return `${firstName}, your trailer rental is active! Return by ${booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'end date'}. Questions? 503-500-6121`;
      case 'completed':
        return `Thank you ${firstName}! Rental complete. Your deposit refund will be processed within 2-3 days. - Molalla Trailer Rentals`;
      default:
        return `Hi ${firstName}, this is Molalla Trailer Rentals regarding your booking. Call 503-500-6121 if you have questions.`;
    }
  };

  const openSmsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`sms:${cleanPhone}?body=${encodedMessage}`, '_blank');
  };

  return (
    <div className="ml-6 p-3 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-2">
      <p className="text-xs font-bold text-blue-900 mb-2">Quick Text Templates:</p>
      <button
        onClick={() => openSmsApp(booking.customer_phone, getSmsTemplate('pickup_reminder'))}
        className="w-full text-left px-3 py-2 bg-white hover:bg-blue-100 rounded border border-blue-200 text-xs transition-colors"
      >
        <span className="font-semibold">Pickup Reminder</span> - Reminder about tomorrow's pickup
      </button>
      <button
        onClick={() => openSmsApp(booking.customer_phone, getSmsTemplate('return_reminder'))}
        className="w-full text-left px-3 py-2 bg-white hover:bg-blue-100 rounded border border-blue-200 text-xs transition-colors"
      >
        <span className="font-semibold">Return Reminder</span> - Reminder to return trailer
      </button>
      <button
        onClick={() => openSmsApp(booking.customer_phone, getSmsTemplate('overdue'))}
        className="w-full text-left px-3 py-2 bg-white hover:bg-red-100 rounded border border-red-200 text-xs transition-colors"
      >
        <span className="font-semibold text-red-700">Overdue Notice</span> - Urgent overdue notification
      </button>
      <button
        onClick={() => openSmsApp(booking.customer_phone, getSmsTemplate('default'))}
        className="w-full text-left px-3 py-2 bg-white hover:bg-blue-100 rounded border border-blue-200 text-xs transition-colors"
      >
        <span className="font-semibold">Custom Message</span> - Blank message to customer
      </button>
    </div>
  );
}
