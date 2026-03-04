import { BookingForm } from '../components/BookingForm';

export function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Book Your Service</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">Fill out the form below and we'll contact you to confirm</p>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}
