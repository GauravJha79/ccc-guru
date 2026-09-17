import type { Metadata } from 'next';
import Link from 'next/link';
import { Smartphone, BookOpen, FlaskConical, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download CCC Guru App — Free for Android & iOS',
  description:
    'Download the CCC Guru mobile app for free. Practice CCC mock tests, read notes, and prepare for NIELIT CCC exam on the go.',
  alternates: { canonical: '/download' },
};

export default function DownloadPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6610f2] to-[#1a8fe3] flex items-center justify-center mx-auto mb-6 shadow-modal">
          <Smartphone className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          Download CCC Guru App
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          Study anytime, anywhere. Access all CCC mock tests, study notes, and expert content
          on your mobile device — even offline.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="#"
            className="btn-primary text-base py-4 px-8"
          >
            📱 Download for Android
          </a>
          <a
            href="#"
            className="btn-secondary text-base py-4 px-8"
          >
            🍎 Download for iOS
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FlaskConical, title: 'Mock Tests', desc: 'Full-length and chapter tests' },
            { icon: BookOpen, title: 'Study Notes', desc: 'Offline PDF access' },
            { icon: Star, title: 'Free Forever', desc: 'No subscription required' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-4 text-center">
              <Icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <p className="font-semibold text-text-primary text-sm">{title}</p>
              <p className="text-xs text-text-muted mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
