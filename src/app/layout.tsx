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

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cccguru.in'
)
  .replace(/cccprep\.in/gi, 'cccguru.in')
  .replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CCC Guru — NIELIT CCC Exam Preparation',
    template: '%s | CCC Guru',
  },
  description:
    'Prepare for NIELIT CCC exam with free mock tests, bilingual study notes, expert blogs, and recommended books. India\'s trusted CCC preparation platform.',
  keywords: [
    'CCC online test',
    'CCC online test in Hindi',
    'CCC mock test',
    'NIELIT CCC exam',
    'CCC online test 2025',
    'free CCC online test',
    'CCC notes PDF',
    'CCC preparation',
    'CCC online test 100 questions',
  ],
  authors: [{ name: 'CCC Guru' }],
  creator: 'CCC Guru',
  publisher: 'CCC Guru',
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
    siteName: 'CCC Guru',
    title: 'CCC Guru — NIELIT CCC Exam Preparation',
    description:
      'Free mock tests, study notes, blogs, and books for NIELIT CCC exam. Start preparing today.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CCC Guru — NIELIT CCC Exam Preparation',
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
