import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  service_label: string;
}

// Real customer reviews only. Add new ones here (no database needed).
// The Supabase "testimonials" table is no longer used.
const TESTIMONIALS: Testimonial[] = [
  {
    id: 'alex-m',
    customer_name: 'Alex M., Molalla OR',
    rating: 5,
    review_text:
      'Quick, efficient service made junk removal easy. Their top-notch customer service is highly recommended!',
    service_label: 'Junk Removal',
  },
];

interface TestimonialsProps {
  /** Review ids already shown elsewhere on the page, so they are not repeated. */
  excludeIds?: string[];
}

export function Testimonials({ excludeIds = [] }: TestimonialsProps) {
  const testimonials = TESTIMONIALS.filter((t) => !excludeIds.includes(t.id));

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
          Read reviews from satisfied customers who have trusted us with their junk removal and hauling.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                "{testimonial.review_text}"
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-slate-800">{testimonial.customer_name}</p>
                <p className="text-sm text-gray-600">{testimonial.service_label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
