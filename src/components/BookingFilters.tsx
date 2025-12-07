import { Search, X } from 'lucide-react';
import { Booking } from '../lib/supabase';

type FilterType = 'all' | 'pending' | 'confirmed' | 'active' | 'overdue' | 'completed' | 'cancelled';

interface BookingFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookings: Booking[];
}

export function BookingFilters({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  bookings,
}: BookingFiltersProps) {
  const getCount = (status: string) => {
    return bookings.filter((b) => b.status === status).length;
  };

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, booking ID, or license number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => onFilterChange('pending')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({getCount('pending')})
        </button>
        <button
          onClick={() => onFilterChange('confirmed')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'confirmed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Confirmed ({getCount('confirmed')})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active Rentals ({getCount('active')})
        </button>
        <button
          onClick={() => onFilterChange('overdue')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            filter === 'overdue'
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-red-100 text-red-800 hover:bg-red-200 border-2 border-red-400'
          }`}
        >
          OVERDUE ({getCount('overdue')})
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed ({getCount('completed')})
        </button>
        <button
          onClick={() => onFilterChange('cancelled')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'cancelled'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cancelled ({getCount('cancelled')})
        </button>
      </div>
    </div>
  );
}
