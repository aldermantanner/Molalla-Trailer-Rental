import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export function TermsAndConditionsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      <div className="bg-slate-800 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center">
              <FileText className="h-7 w-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Terms and Conditions</h1>
              <p className="text-slate-300 mt-1">Last updated: February 10, 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to Bare Acre Hauling. These Terms and Conditions ("Terms") govern your use of our website at bareacrehauling.com (the "Site") and all services provided by Bare Acre Hauling ("we," "us," or "our"), including junk removal services and related offerings. By accessing our Site or using our services, you agree to be bound by these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600">
              By accessing or using our Site and services, you confirm that you are at least 18 years of age, possess a valid driver's license (for trailer rentals), and agree to comply with and be bound by these Terms. If you do not agree to these Terms, you must not use our Site or services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              2. Services
            </h2>
            <p className="text-gray-600 mb-4">Bare Acre Hauling offers the following services:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Dump Trailer Rentals:</strong> Daily, weekly, and monthly rental of dump trailers for personal and commercial use.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Junk Removal:</strong> Full-service junk removal, "You Fill, We Dump" packages, cleanout specials, and landlord/move-out services.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Delivery and Pickup:</strong> Optional trailer delivery and pickup services within our service area.</span>
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              All services are subject to availability and may be modified at our discretion.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              3. Booking and Reservations
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>All bookings are subject to trailer availability and our confirmation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>A valid form of payment is required to complete a reservation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Trailer rental bookings require a signed rental agreement, a valid driver's license, and proof of insurance prior to receiving the trailer.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>"You Fill, We Dump" junk removal bookings require a signed service agreement acknowledging prohibited materials and liability terms.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>We reserve the right to refuse service to anyone at our sole discretion.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              4. Pricing and Payment
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>All prices displayed on the Site are in US Dollars and are subject to change without notice.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Junk removal pricing is based on volume (trailer space used) and material type. Final pricing is confirmed on-site based on actual conditions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>A non-refundable deposit of $50 is required for all trailer rentals. The deposit is refundable only upon satisfactory return of the trailer following inspection.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Payments are processed securely. We do not store credit card information on our servers.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Additional fees may apply for delivery, late returns, overweight loads, special disposal requirements, or damage to equipment.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              5. Cancellation and Refund Policy
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
              <p className="font-semibold text-slate-800 mb-3">Trailer Rental Cancellations:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 flex-shrink-0"></span>
                  <span><strong>More than 24 hours before rental start:</strong> 100% refund (minus deposit)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 flex-shrink-0"></span>
                  <span><strong>12-24 hours before rental start:</strong> 50% refund (minus deposit)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 flex-shrink-0"></span>
                  <span><strong>Less than 12 hours before rental start:</strong> No refund</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-600">
              The $50 deposit is non-refundable upon cancellation and will only be refunded after satisfactory trailer inspection upon return. All cancellations must be made through the customer portal or by contacting us directly.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              6. Trailer Rental Terms
            </h2>
            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Renter Responsibilities</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>You must possess a valid driver's license and maintain adequate automobile liability insurance for the duration of the rental period.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>You must return the trailer on the date and time specified in your rental agreement, in the same condition as received (ordinary wear excepted).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>You are responsible for all damage to, loss, or theft of the trailer during your rental period, whether or not you are at fault.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>All accidents and incidents must be reported to us and the police within 24 hours.</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Prohibited Uses</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Transporting hazardous, dangerous, or illegal materials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Transporting persons in or on the trailer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Use by unauthorized or unlicensed drivers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Use while under the influence of drugs or alcohol</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Overloading beyond the trailer's rated capacity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Any intentional misuse or abuse of equipment</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Late Returns</h3>
            <p className="text-gray-600">
              Late returns are subject to a fee of $50 per hour. Extended rental periods must be arranged in advance and are subject to availability.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              7. Junk Removal Service Terms
            </h2>
            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">General Terms</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Junk removal pricing is based on the volume of trailer space used and the type of materials being disposed of.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>The minimum service charge for junk removal is $150.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>We reserve the right to inspect all materials before loading and hauling.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Heavy or restricted materials (concrete, dirt, brick, roofing material) require a custom quote.</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">"You Fill, We Dump" Service</h3>
            <p className="text-gray-600 mb-4">
              Customers who select the "You Fill, We Dump" service must sign a Junk Removal Agreement acknowledging:
            </p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>You will not place any hazardous, prohibited, or restricted materials in the trailer.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>You are fully responsible and liable for any damages, fines, penalties, or costs resulting from placing prohibited materials in the trailer.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>A minimum penalty of $500 plus actual costs will be assessed for prohibited material violations.</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Items We Do Not Accept</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Hazardous waste, chemicals, solvents, or flammable liquids</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Paint, pesticides, herbicides, or asbestos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Propane tanks, compressed gas cylinders, or explosives</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Medical waste, biohazards, or infectious materials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Automotive batteries, industrial batteries, or lithium batteries</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-4">
              To the fullest extent permitted by applicable law:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Bare Acre Hauling provides all trailers and equipment on an "as-is" basis without warranties of any kind, express or implied, including warranties of merchantability or fitness for a particular purpose.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of our services or equipment.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Our total liability for any claim shall not exceed the amount paid by you for the specific service giving rise to the claim.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>You agree to indemnify, defend, and hold harmless Bare Acre Hauling, its owners, employees, and agents from any claims, damages, or expenses arising from your use of our trailers or services.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              9. Insurance Requirements
            </h2>
            <p className="text-gray-600">
              All trailer renters must maintain valid automobile liability insurance for the duration of the rental period. Proof of insurance must be provided at the time of booking. Renters are responsible for any deductible amounts and any damages not covered by their insurance. We recommend reviewing your policy to ensure adequate coverage for towing and trailer use.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              10. Intellectual Property
            </h2>
            <p className="text-gray-600">
              All content on the Site, including text, graphics, logos, images, and software, is the property of Bare Acre Hauling or its content suppliers and is protected by United States copyright and trademark laws. You may not reproduce, distribute, modify, or create derivative works from any content on the Site without our express written consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              11. Governing Law and Dispute Resolution
            </h2>
            <p className="text-gray-600 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of Oregon, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-600">
              Any dispute arising under or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation. If the dispute cannot be resolved informally, it shall be submitted to binding arbitration in Clackamas County, Oregon, in accordance with the rules of the American Arbitration Association.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              12. Severability
            </h2>
            <p className="text-gray-600">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining provisions of these Terms shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              13. Changes to These Terms
            </h2>
            <p className="text-gray-600">
              We reserve the right to modify or replace these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the Site and services after changes are posted constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section className="bg-slate-50 rounded-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              14. Contact Us
            </h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Bare Acre Hauling</p>
                <p className="text-gray-600">Molalla, OR</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  <strong className="text-slate-700">Phone:</strong>{' '}
                  <a href="tel:503-874-3705" className="text-green-600 hover:text-green-700 transition-colors">503-874-3705</a>
                </p>
                <p className="text-gray-600">
                  <strong className="text-slate-700">Email:</strong>{' '}
                  <a href="mailto:BareAcreHauling@outlook.com" className="text-green-600 hover:text-green-700 transition-colors">BareAcreHauling@outlook.com</a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
