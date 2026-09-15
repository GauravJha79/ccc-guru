import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service — CCC Prep',
  description: 'Terms of service for CCC Prep. Read our terms and conditions for using the platform.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />
      <h1 className="text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
      <p className="text-sm text-text-muted mb-8">Last updated: August 2025</p>
      <div className="prose-ccc space-y-5">
        <p>
          By using CCC Prep, you agree to these Terms of Service. Please read them carefully.
        </p>
        <h2>Use of the Platform</h2>
        <ul>
          <li>CCC Prep is provided for educational purposes only.</li>
          <li>You must not misuse or attempt to disrupt the platform.</li>
          <li>Content on this platform is for personal, non-commercial use only.</li>
        </ul>
        <h2>Content</h2>
        <p>
          All content on CCC Prep (tests, notes, blogs, books) is created for educational purposes.
          We do not guarantee 100% accuracy of all content. Always verify important information
          from official NIELIT sources.
        </p>
        <h2>Disclaimer</h2>
        <p>
          CCC Prep is an independent educational platform and is not affiliated with or endorsed
          by NIELIT or any government body. &quot;CCC&quot; refers to the NIELIT Course on Computer
          Concepts examination.
        </p>
        <h2>Affiliate Links</h2>
        <p>
          Some links on this platform (particularly on the Books section) are affiliate links.
          We may earn a commission from purchases at no extra cost to you.
        </p>
        <h2>Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of the platform constitutes
          acceptance of the updated terms.
        </p>
        <h2>Contact</h2>
        <p>
          For any questions, contact us at{' '}
          <a href="mailto:hello@cccprep.in">hello@cccprep.in</a>.
        </p>
      </div>
    </div>
  );
}
