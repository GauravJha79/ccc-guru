import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About CCC Guru — Free NIELIT CCC Preparation Platform',
  description:
    'Learn about CCC Guru — India\'s trusted free educational platform for NIELIT CCC exam preparation, bilingual mock tests, syllabus, and study resources.',
  alternates: { canonical: 'https://www.cccguru.in/about' },
  openGraph: {
    title: 'About CCC Guru — Free NIELIT CCC Preparation Platform',
    description:
      'Learn about CCC Guru — India\'s trusted free educational platform for NIELIT CCC exam preparation.',
    url: 'https://www.cccguru.in/about',
  },
};

export default function AboutPage() {
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
        name: 'About Us',
        item: 'https://www.cccguru.in/about',
      },
    ],
  };

  return (
    <div className="container-page py-8 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumbs items={[{ label: 'About' }]} />
      <h1 className="text-3xl font-bold text-text-primary mb-4">About CCC Guru</h1>
      <div className="prose-ccc space-y-4">
        {/* Independent Educational Platform Disclaimer */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-sm">
          <strong>Important Disclaimer:</strong> CCC Guru (cccguru.in) is an independent, non-commercial educational portal. We are <strong>not affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with the National Institute of Electronics &amp; Information Technology (NIELIT)</strong> or any government body. The official NIELIT portal is hosted at <a href="https://student.nielit.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">student.nielit.gov.in</a>. All mock tests, questions, and guides provided here are based on the publicly available official NIELIT CCC curriculum and are designed strictly for student self-study and examination practice.
        </div>

        <p>
          <strong>CCC Guru</strong> is an open-access educational platform dedicated to helping
          students and job aspirants across India prepare for the{' '}
          <strong>NIELIT CCC (Course on Computer Concepts)</strong> examination.
        </p>
        <p>
          We believe that quality computer literacy and exam preparation should be accessible to everyone, regardless of
          location or financial background. Our platform provides free bilingual mock tests,
          chapter-wise study notes, practice questions, and exam tips — all structured according to the latest official syllabus.
        </p>
        <h2>Our Mission</h2>
        <p>
          To empower students preparing for government, banking, and public-service employment exams that require CCC certification by providing high-quality, bilingual (Hindi &amp; English) learning resources completely free of charge.
        </p>
        <h2>What We Offer</h2>
        <ul>
          <li><strong>Free Bilingual Mock Tests:</strong> 100-question full-length timed tests matching the CBT pattern in Hindi and English.</li>
          <li><strong>Chapter-wise Practice:</strong> Targeted tests covering all 10 modules, including LibreOffice Writer, Calc, Impress, Internet, and Cyber Security.</li>
          <li><strong>Updated Curriculum:</strong> Aligned with NIELIT Revision 4 syllabus with zero outdated proprietary office suite questions.</li>
          <li><strong>Instant Result Analysis:</strong> Detailed question-level feedback, correct answers, and performance grading.</li>
        </ul>
        <h2>How Content Is Curated &amp; Maintained</h2>
        <p>
          All questions and learning modules on CCC Guru are regularly audited to ensure they align with the latest NIELIT examination blueprint. We prioritize practical software topics like LibreOffice rather than legacy commercial tools, ensuring students practice the exact question formats they will encounter during the computer-based exam.
        </p>
        <h2>Contact &amp; Feedback</h2>
        <p>
          Have a question, feedback, or a suggestion to improve our study materials?{' '}
          <Link href="/contact" className="text-primary-600 hover:underline">
            Reach out via our Contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
