'use client';

import { useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire this to a form service (e.g. Formspree, or Supabase edge function)
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card p-6 text-center">
        <div className="text-3xl mb-3">✅</div>
        <h3 className="font-semibold text-text-primary mb-1">Message Sent!</h3>
        <p className="text-sm text-text-muted">Thank you. We'll get back to you within 24-48 hours.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-text-primary mb-4">Send a Message</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-text-secondary mb-1">
            Name
          </label>
          <input id="contact-name" type="text" className="input-base" placeholder="Your name" required />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-text-secondary mb-1">
            Email
          </label>
          <input id="contact-email" type="email" className="input-base" placeholder="your@email.com" required />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-text-secondary mb-1">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            className="input-base resize-none"
            placeholder="Your message..."
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full justify-center">
          Send Message
        </button>
      </form>
    </div>
  );
}
