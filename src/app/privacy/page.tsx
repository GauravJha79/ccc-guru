import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy — CCC Guru',
  description: 'Privacy policy for CCC Guru. Learn how we collect, use, and protect your information.',
  alternates: { canonical: 'https://www.cccguru.in/privacy' },
};

export default function PrivacyPage() {
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
        name: 'Privacy Policy',
        item: 'https://www.cccguru.in/privacy',
      },
    ],
  };

  return (
    <div className="container-page py-8 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
      <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
      <p className="text-sm text-text-muted mb-8">Last updated: 2026</p>
      <div className="prose-ccc space-y-5">
        <p>
          CCC Guru (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This policy
          explains how we collect, use, and protect your information when you access our website at cccguru.in.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We may collect information you voluntarily provide (such as your email address when
          registering for test bookmarking or accounts) and anonymous technical usage data (such as pages visited, browser type, and test completion statistics) through standard web analytics.
        </p>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To provide and improve our mock tests, study materials, and educational tools</li>
          <li>To analyze overall website performance and user experience</li>
          <li>To prevent fraudulent activity and ensure platform security</li>
        </ul>
        <h2>Third-Party Services &amp; Advertising</h2>
        <p>
          We use trusted third-party service providers to support our educational platform:
        </p>
        <ul>
          <li><strong>Google Analytics:</strong> We use Google Analytics (measurement ID G-VL371334SD) to understand aggregate traffic trends and popular study resources.</li>
          <li><strong>Google AdSense:</strong> We display advertisements served by Google AdSense to fund our free educational tools. Google and its third-party vendors use cookies (including the DoubleClick cookie) to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.</li>
          <li><strong>Supabase:</strong> For cloud data persistence, user authentication, and secure session management.</li>
        </ul>
        <h2>Cookies and Tracking Technologies</h2>
        <p>
          Cookies are small text files stored on your device. We use necessary cookies for session management and theme preferences (light/dark mode). Third-party vendors, including Google, use cookies to serve ads based on your prior visits. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">aboutads.info</a>.
        </p>
        <h2>Data Security</h2>
        <p>
          We employ industry-standard encryption and security measures. We never sell, rent, or trade your personal information to third parties.
        </p>
        <h2>Contact</h2>
        <p>
          If you have any questions regarding this privacy policy or our privacy practices, please contact us at{' '}
          <a href="mailto:hello@cccguru.in" className="text-primary-600 underline">hello@cccguru.in</a>.
        </p>
      </div>
    </div>
  );
}
