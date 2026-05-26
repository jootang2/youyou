import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Youyou Buyer Portal',
  description: 'Buyer portal for project access, preview review, and approved deploy flow.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
