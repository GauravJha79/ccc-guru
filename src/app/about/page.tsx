import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About CCC Guru',
  description: 'Learn about CCC Guru — India\'s trusted free platform for NIELIT CCC exam preparation.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="container-page py-8 max-w-3xl">
      <Breadcrumbs items={[{ label: 'About' }]} />
      <h1 className="text-3xl font-bold text-text-primary mb-4">About CCC Guru</h1>
      <div className="prose-ccc space-y-4">
        <p>
          <strong>CCC Guru</strong> is a free, open-access educational platform dedicated to helping
          students and professionals across India prepare for the{' '}
          <strong>NIELIT CCC (Course on Computer Concepts)</strong> examination.
        </p>
        <p>
          We believe that quality exam preparation should be accessible to everyone, regardless of
          location or financial background. Our platform provides free bilingual mock tests,
          downloadable study notes, expert blog articles, and recommended books — all in one place.
        </p>
        <h2>Our Mission</h2>
        <p>
          To democratize CCC exam preparation by providing high-quality, bilingual (Hindi & English)
          resources for free, helping every aspirant achieve their goal of obtaining the CCC certificate.
        </p>
        <h2>What We Offer</h2>
        <ul>
          <li>Free bilingual mock tests (Hindi + English)</li>
          <li>Chapter-wise study notes in PDF format</li>
          <li>Expert articles and exam tips</li>
          <li>Recommended books with buy links</li>
          <li>Complete updated CCC syllabus</li>
          <li>Mobile app for on-the-go preparation</li>
        </ul>
        <h2>Contact Us</h2>
        <p>
          Have a question or suggestion? We'd love to hear from you.{' '}
          <Link href="/contact" className="text-primary-600 hover:underline">
            Get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
