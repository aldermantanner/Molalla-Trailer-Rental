import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { AdminBookings } from '../components/AdminBookings';
import { AdminLogin } from '../components/AdminLogin';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-white border-b border-gray-200 mb-4 sm:mb-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>
      <AdminBookings />
    </div>
  );
}
