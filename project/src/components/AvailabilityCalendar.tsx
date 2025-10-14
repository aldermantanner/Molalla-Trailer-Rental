import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DayAvailability {
  date: string;
  available: number;
  isAvailable: boolean;
}

export function AvailabilityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailability();
  }, [currentDate]);

  const loadAvailability = async () => {
    setLoading(true);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];

    const { data: bookings } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .in('status', ['confirmed', 'pending'])
      .eq('service_type', 'rental')
      .gte('end_date', startDate)
      .lte('start_date', endDate);

    const availabilityMap = new Map<string, number>();
    const totalTrailers = 2;

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      let bookedCount = 0;

      bookings?.forEach(booking => {
        const bookingStart = new Date(booking.start_date);
        const bookingEnd = booking.end_date ? new Date(booking.end_date) : bookingStart;
        const checkDate = new Date(dateStr);

        if (checkDate >= bookingStart && checkDate <= bookingEnd) {
          bookedCount++;
        }
      });

      availabilityMap.set(dateStr, totalTrailers - bookedCount);
    }

    setAvailability(availabilityMap);
    setLoading(false);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (DayAvailability | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const available = availability.get(dateStr) || 0;
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push({
        date: dateStr,
        available,
        isAvailable: available > 0 && !isPast
      });
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <CalendarIcon className="h-10 w-10 text-green-600 mr-3" />
            <h2 className="text-4xl font-bold text-slate-800">Check Trailer Availability</h2>
          </div>
          <p className="text-xl text-gray-600">
            See real-time availability for our dump trailers
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-6 w-6 text-slate-700" />
            </button>
            <h3 className="text-2xl font-bold text-slate-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-6 w-6 text-slate-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayNumber = new Date(day.date).getDate();
                const isPast = new Date(day.date) < new Date(new Date().setHours(0, 0, 0, 0));

                return (
                  <div
                    key={day.date}
                    className={`aspect-square border-2 rounded-lg p-2 flex flex-col items-center justify-center transition-all ${
                      isPast
                        ? 'bg-gray-100 border-gray-200 opacity-50'
                        : day.isAvailable
                        ? 'border-green-500 bg-green-50 hover:bg-green-100'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <span className={`text-lg font-semibold ${
                      isPast ? 'text-gray-400' : day.isAvailable ? 'text-green-700' : 'text-red-600'
                    }`}>
                      {dayNumber}
                    </span>
                    <span className={`text-xs font-medium mt-1 ${
                      isPast ? 'text-gray-400' : day.isAvailable ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {isPast ? 'Past' : `${day.available} left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-green-500 bg-green-50 rounded mr-2"></div>
                <span className="text-gray-700">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-red-300 bg-red-50 rounded mr-2"></div>
                <span className="text-gray-700">Fully Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-200 bg-gray-100 rounded mr-2"></div>
                <span className="text-gray-700">Past Date</span>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-4">
              We have 2 trailers available. Book early to secure your dates!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
