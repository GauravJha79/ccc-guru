import type { Metadata } from 'next';
import { Mail, MessageCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — CCC Guru Support & Inquiries',
  description:
    "Get in touch with CCC Guru. Have questions or feedback about NIELIT CCC exam preparation, mock tests, or study material? We are here to help.",
  alternates: { canonical: 'https://www.cccguru.in/contact' },
  openGraph: {
    title: 'Contact Us — CCC Guru Support & Inquiries',
    description: "Get in touch with CCC Guru for any inquiries or support.",
    url: 'https://www.cccguru.in/contact',
  },
};

export default function ContactPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.cccguru.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact Us',
        item: 'https://www.cccguru.in/contact',
      },
    ],
  };

  return (
    <div className="container-page py-8 max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <h1 className="text-3xl font-bold text-text-primary mb-4">Contact Us</h1>
      <p className="text-text-muted mb-8">
        Have a question, suggestion, or feedback? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <a
          href="mailto:hello@cccguru.in"
          className="card p-5 flex items-center gap-4 hover:border-primary-400 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
              Email Us
            </p>
            <p className="text-sm text-text-muted">hello@cccguru.in</p>
          </div>
        </a>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-text-primary">Response Time</p>
            <p className="text-sm text-text-muted">Usually within 24-48 hours</p>
          </div>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
