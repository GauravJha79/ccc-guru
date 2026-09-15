import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccprep.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CCC Prep — NIELIT CCC Exam Preparation',
    template: '%s | CCC Prep',
  },
  description:
    'Prepare for NIELIT CCC exam with free mock tests, bilingual study notes, expert blogs, and recommended books. India\'s trusted CCC preparation platform.',
  keywords: ['CCC exam', 'NIELIT CCC', 'CCC mock test', 'CCC notes', 'CCC preparation', 'CCC online test'],
  authors: [{ name: 'CCC Prep' }],
  creator: 'CCC Prep',
  publisher: 'CCC Prep',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'CCC Prep',
    title: 'CCC Prep — NIELIT CCC Exam Preparation',
    description:
      'Free mock tests, study notes, blogs, and books for NIELIT CCC exam. Start preparing today.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CCC Prep — NIELIT CCC Exam Preparation',
    description: 'Free mock tests, study notes, blogs, and books for NIELIT CCC exam.',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
