import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function PrivacyPolicyPage() {
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
              <Shield className="h-7 w-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
              <p className="text-slate-300 mt-1">Last updated: February 10, 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed">
              Molalla Trailer Rentals ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website rentmolallatrailers.com (the "Site") or use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              1. Information We Collect
            </h2>
            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-600 mb-4">
              We may collect personal information that you voluntarily provide when using our services, including:
            </p>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Full name, email address, and phone number</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Mailing and delivery addresses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Driver's license information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Vehicle insurance information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Payment and billing information (processed securely through Stripe)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Electronic signatures on rental and service agreements</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-600 mb-4">
              When you visit our Site, we may automatically collect certain information, including:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>IP address and browser type</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Device information and operating system</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Pages visited, time spent on pages, and referring URLs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Cookies and similar tracking technologies</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Process and manage your trailer rental bookings and junk removal services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Communicate with you regarding your bookings, including confirmations, reminders, and status updates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Process payments securely through our third-party payment processor (Stripe)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Verify your identity and eligibility for trailer rental services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Improve our website, services, and customer experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Comply with legal obligations and enforce our terms of service</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Service Providers:</strong> We share information with trusted third-party service providers who assist in operating our business, such as payment processors (Stripe), email services, and hosting providers (Supabase).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Legal Requirements:</strong> We may disclose your information if required by law, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              4. Data Security
            </h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>SSL/TLS encryption for all data transmitted through our Site</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Secure database storage with row-level security policies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>PCI-compliant payment processing through Stripe (we never store your credit card details)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span>Regular review and updates to our security practices</span>
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 mb-4">
              Our Site may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us analyze site usage and improve functionality.
            </p>
            <p className="text-gray-600">
              You can control cookies through your browser settings. Disabling cookies may affect some features of the Site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              6. Your Rights
            </h2>
            <p className="text-gray-600 mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Access:</strong> Request a copy of the personal information we hold about you.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Correction:</strong> Request that we correct inaccurate or incomplete information.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Deletion:</strong> Request that we delete your personal information, subject to legal retention requirements.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                <span><strong className="text-slate-700">Opt-Out:</strong> Opt out of receiving marketing communications from us at any time.</span>
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              7. Third-Party Links
            </h2>
            <p className="text-gray-600">
              Our Site may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. We encourage you to review the privacy policies of those sites before providing any personal information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              8. Children's Privacy
            </h2>
            <p className="text-gray-600">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without verification of parental consent, we will take steps to remove that information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              9. Data Retention
            </h2>
            <p className="text-gray-600">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Rental agreement records and associated documentation may be retained for a period of up to seven (7) years for legal and compliance purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this Privacy Policy periodically. Your continued use of the Site after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section className="bg-slate-50 rounded-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Molalla Trailer Rentals</p>
                <p className="text-gray-600">Molalla, OR</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  <strong className="text-slate-700">Phone:</strong>{' '}
                  <a href="tel:971-459-0077" className="text-green-600 hover:text-green-700 transition-colors">971-459-0077</a>
                </p>
                <p className="text-gray-600">
                  <strong className="text-slate-700">Email:</strong>{' '}
                  <a href="mailto:Molallatrailerrental@outlook.com" className="text-green-600 hover:text-green-700 transition-colors">Molallatrailerrental@outlook.com</a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
