import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  service_type: string;
  is_featured: boolean;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getServiceLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'rental':
        return 'Trailer Rental';
      case 'junk_removal':
        return 'Junk Removal';
      case 'material_delivery':
        return 'Material Delivery';
      default:
        return 'Customer';
    }
  };

  if (loading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Read reviews from satisfied customers who have used our dump trailer rentals, junk removal, and material delivery services.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              {renderStars(testimonial.rating)}
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                "{testimonial.review_text}"
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-slate-800">{testimonial.customer_name}</p>
                <p className="text-sm text-gray-600">{getServiceLabel(testimonial.service_type)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
