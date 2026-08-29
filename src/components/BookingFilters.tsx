import { Search, X } from 'lucide-react';
import { Booking } from '../lib/supabase';

type FilterType = 'all' | 'pending' | 'awaiting_approval' | 'confirmed' | 'active' | 'overdue' | 'completed' | 'cancelled';

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
      <div className="mb-3 sm:mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
            filter === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => onFilterChange('pending')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
            filter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="hidden sm:inline">Pending</span>
          <span className="sm:hidden">Pend</span> ({getCount('pending')})
        </button>
        <button
          onClick={() => onFilterChange('awaiting_approval')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
            filter === 'awaiting_approval'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="hidden sm:inline">Awaiting Approval</span>
          <span className="sm:hidden">Review</span> ({getCount('awaiting_approval')})
        </button>
        <button
          onClick={() => onFilterChange('confirmed')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
            filter === 'confirmed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="hidden sm:inline">Confirmed</span>
          <span className="sm:hidden">Conf</span> ({getCount('confirmed')})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="hidden sm:inline">Active Jobs</span>
          <span className="sm:hidden">Active</span> ({getCount('active')})
        </button>
        <button
          onClick={() => onFilterChange('overdue')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold transition-colors text-xs sm:text-sm ${
            filter === 'overdue'
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-red-100 text-red-800 hover:bg-red-200 border-2 border-red-400'
          }`}
        >
          <span className="hidden sm:inline">OVERDUE</span>
          <span className="sm:hidden">LATE</span> ({getCount('overdue')})
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
            filter === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="hidden sm:inline">Completed</span>
          <span className="sm:hidden">Done</span> ({getCount('completed')})
        </button>
        <button
          onClick={() => onFilterChange('cancelled')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${
            filter === 'cancelled'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="hidden sm:inline">Cancelled</span>
          <span className="sm:hidden">Cancel</span> ({getCount('cancelled')})
        </button>
      </div>
    </div>
  );
}
