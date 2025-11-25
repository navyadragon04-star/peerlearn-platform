import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../src/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PeerLearn - Peer-to-Peer Learning Platform',
  description: 'Connect with peers, join study rooms, and learn together',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
