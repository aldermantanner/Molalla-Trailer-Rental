import { BookingForm } from '../components/BookingForm';

export function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Book Your Service</h1>
          <p className="text-xl text-gray-600">Fill out the form below and we'll contact you to confirm</p>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}
