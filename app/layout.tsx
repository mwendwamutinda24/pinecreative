import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pine Creatives - Digital Agency',
  description:
    'We create & market Digital Products. Elevate your digital experience with our cutting-edge suite of meticulously crafted digital products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Toast notifications will render here */}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
