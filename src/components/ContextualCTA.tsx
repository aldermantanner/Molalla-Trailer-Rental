import { Calendar, Phone } from 'lucide-react';

interface ContextualCTAProps {
  message: string;
  variant?: 'services' | 'pricing' | 'general';
  onBookClick: () => void;
}

export function ContextualCTA({ message, variant = 'general', onBookClick }: ContextualCTAProps) {
  const bgColors = {
    services: 'bg-gradient-to-r from-green-600 to-green-700',
    pricing: 'bg-gradient-to-r from-slate-700 to-slate-800',
    general: 'bg-gradient-to-r from-green-600 to-green-700'
  };

  return (
    <section className={`py-12 px-4 sm:px-6 lg:px-8 ${bgColors[variant]}`}>
      <div className="max-w-4xl mx-auto text-center text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{message}</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onBookClick}
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 min-w-[200px]"
          >
            <Calendar className="h-5 w-5" />
            Book Online Now
          </button>
          <span className="text-white font-semibold hidden sm:block">or</span>
          <a
            href="tel:503-500-6121"
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white/30 transition-all shadow-lg flex items-center justify-center gap-2 min-w-[200px]"
          >
            <Phone className="h-5 w-5" />
            503-500-6121
          </a>
        </div>
      </div>
    </section>
  );
}
