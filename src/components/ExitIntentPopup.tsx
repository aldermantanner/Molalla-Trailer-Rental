import { useState, useEffect } from 'react';
import { X, Calendar, Phone, Tag } from 'lucide-react';

interface ExitIntentPopupProps {
  onBookClick: () => void;
}

export function ExitIntentPopup({ onBookClick }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const checkExitIntent = (e: MouseEvent) => {
      if (hasShown) return;

      if (e.clientY <= 0) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('exitPopupShown', Date.now().toString());
      }
    };

    const checkLocalStorage = () => {
      const lastShown = localStorage.getItem('exitPopupShown');
      if (lastShown) {
        const daysSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
        if (daysSinceShown < 7) {
          setHasShown(true);
        }
      }
    };

    checkLocalStorage();
    document.addEventListener('mouseleave', checkExitIntent);

    return () => {
      document.removeEventListener('mouseleave', checkExitIntent);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBookNow = () => {
    setIsVisible(false);
    onBookClick();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Tag className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Wait! Before You Go...
          </h2>
          <p className="text-lg text-gray-600">
            Get <span className="text-red-600 font-bold">$10 OFF</span> your first rental!
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Tag className="h-6 w-6 text-red-600" />
            <span className="text-2xl font-bold text-red-600">FIRST10</span>
          </div>
          <p className="text-center text-gray-700 font-semibold">
            Use code at checkout for $10 off any rental!
          </p>
          <p className="text-center text-sm text-gray-600 mt-2">
            Valid for new customers • Expires in 7 days
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleBookNow}
            className="w-full bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            Book Now & Save $10
          </button>

          <a
            href="tel:503-500-6121"
            className="w-full bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-slate-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Phone className="h-5 w-5" />
            Call: 503-500-6121
          </a>

          <button
            onClick={handleClose}
            className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
          >
            No thanks, I'll pay full price
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-slate-800">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">5.0★</div>
              <div className="text-gray-600">Rating</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">Same Day</div>
              <div className="text-gray-600">Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
