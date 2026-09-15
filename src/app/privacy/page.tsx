import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy — CCC Prep',
  description: 'Privacy policy for CCC Prep. Learn how we collect, use, and protect your information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
      <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
      <p className="text-sm text-text-muted mb-8">Last updated: August 2025</p>
      <div className="prose-ccc space-y-5">
        <p>
          CCC Prep ("we", "our", or "us") is committed to protecting your privacy. This policy
          explains how we collect and use information when you use our website and mobile application.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We may collect information you voluntarily provide (such as your email address when
          registering) and usage data (such as pages visited) through standard web analytics.
        </p>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To provide and improve our services</li>
          <li>To send you updates or newsletters (only if you opt in)</li>
          <li>To analyze usage and improve user experience</li>
        </ul>
        <h2>Third-Party Services</h2>
        <p>
          We use Supabase for data storage and authentication, and may use standard analytics tools.
          We may display affiliate links to Amazon, Flipkart, and other retailers. We may earn a
          commission if you purchase through these links at no additional cost to you.
        </p>
        <h2>Cookies</h2>
        <p>
          We use cookies to remember your theme preference and session. We do not use tracking cookies
          for advertising.
        </p>
        <h2>Data Security</h2>
        <p>
          We use industry-standard security measures to protect your data. We never sell your personal
          information to third parties.
        </p>
        <h2>Contact</h2>
        <p>
          If you have any questions about this privacy policy, please contact us at{' '}
          <a href="mailto:hello@cccprep.in">hello@cccprep.in</a>.
        </p>
      </div>
    </div>
  );
}
