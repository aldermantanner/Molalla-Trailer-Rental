import { useState } from 'react';
import { MessageCircle, X, Send, Phone, Mail } from 'lucide-react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mailtoLink = `mailto:Molallatrailerrental@outlook.com?subject=Quick Question from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setName('');
      setContact('');
      setIsOpen(false);
    }, 3000);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all hover:scale-110 z-50 flex items-center gap-2 group"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="hidden group-hover:inline-block text-sm font-semibold pr-2">
            Need Help?
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[600px]">
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Quick Contact</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {!submitted ? (
              <>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    Hi! We're here to help. Send us a quick message or call us directly.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="tel:503-500-6121"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                      <Phone className="h-4 w-4" />
                      503-500-6121
                    </a>
                    <a
                      href="mailto:Molallatrailerrental@outlook.com"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                      <Mail className="h-4 w-4" />
                      Email Us
                    </a>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="chat-name" className="block text-xs font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="chat-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="chat-contact" className="block text-xs font-medium text-gray-700 mb-1">
                      Phone or Email
                    </label>
                    <input
                      type="text"
                      id="chat-contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="your@email.com or (503) 555-1234"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="chat-message" className="block text-xs font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="chat-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  We typically respond within a few hours during business hours
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h4>
                <p className="text-gray-600 text-center text-sm">
                  Thank you for contacting us. We'll get back to you soon!
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              Veteran Owned & Operated
            </p>
          </div>
        </div>
      )}
    </>
  );
}
