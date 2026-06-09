import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { submitSupportTicket } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function HelpSupport() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitSupportTicket({ subject, message });
      toast.success('Support ticket submitted successfully!');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    { q: 'How do I reset my password?', a: 'You can change your password in the Security settings section.' },
    { q: 'How to enable 2FA?', a: 'Go to Security settings and toggle the Two-Factor Authentication switch to On. Follow the prompts.' },
    { q: 'How to change language?', a: 'Navigate to the Language settings menu and select from our 20 supported languages.' },
    { q: 'How do I contact support?', a: 'You can use the contact form below to submit a support ticket.' },
  ];

  return (
    <div className="max-w-md mx-auto w-full pb-10">
      <Toaster position="top-center" />
      <div className="flex items-center gap-4 mb-6 px-2">
        <Link to="/settings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Help & Support</h1>
      </div>

      <div className="space-y-6">
        {/* FAQs */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 px-2">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group">
                <summary className="px-5 py-4 cursor-pointer text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed bg-slate-50">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Us Form */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 px-2">Contact Us</h2>
          <form onSubmit={handleSupportSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
                placeholder="Briefly describe your issue"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all resize-none h-32"
                placeholder="How can we help you?"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !subject || !message}
              className="w-full flex items-center justify-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* App Info */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 px-2">App Information</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="flex items-center justify-between p-5">
              <p className="text-sm font-semibold text-slate-900">Version</p>
              <p className="text-sm text-slate-500">1.0.0</p>
            </div>
            <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer text-left">
              <p className="text-sm font-semibold text-slate-900">Privacy Policy</p>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
            <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer text-left">
              <p className="text-sm font-semibold text-slate-900">Terms & Conditions</p>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
