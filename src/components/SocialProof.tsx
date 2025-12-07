import { Star, Users, Calendar, Award } from 'lucide-react';

export function SocialProof() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <Star className="h-8 w-8 fill-white" />
            </div>
            <div className="text-4xl font-bold">5.0</div>
            <div className="text-sm opacity-90">Star Rating</div>
            <div className="text-xs opacity-75">Google Reviews</div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <Users className="h-8 w-8" />
            </div>
            <div className="text-4xl font-bold">500+</div>
            <div className="text-sm opacity-90">Happy Customers</div>
            <div className="text-xs opacity-75">Since 2020</div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="text-4xl font-bold">2000+</div>
            <div className="text-sm opacity-90">Rentals Completed</div>
            <div className="text-xs opacity-75">And counting</div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <Award className="h-8 w-8" />
            </div>
            <div className="text-4xl font-bold">100%</div>
            <div className="text-sm opacity-90">Veteran Owned</div>
            <div className="text-xs opacity-75">Trusted Service</div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white text-lg mb-4 font-semibold">
            Join hundreds of satisfied customers in Molalla and surrounding areas
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-white/90">
            <span className="bg-white/20 px-4 py-2 rounded-full">Molalla</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Canby</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Oregon City</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Woodburn</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Clackamas County</span>
          </div>
        </div>
      </div>
    </section>
  );
}
