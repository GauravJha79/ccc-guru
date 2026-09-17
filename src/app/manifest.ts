import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CCC Guru — NIELIT CCC Exam Preparation',
    short_name: 'CCC Guru',
    description:
      'Free bilingual mock tests, chapter-wise PDF study notes, expert articles and recommended books for NIELIT CCC exam preparation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6610f2',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
