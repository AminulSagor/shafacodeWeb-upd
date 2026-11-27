import type { Metadata } from 'next';
import { Poppins, Instrument_Serif } from 'next/font/google';
import '../globals.css';
import { Navbar } from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  subsets: ['latin'],
});

const instrument = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shafacode.com'),

  title: {
    default: 'ShafaCode – Next Generation Software Development',
    template: '%s | ShafaCode',
  },
  description:
    'ShafaCode helps startups and businesses build high-quality web, mobile, and software products.',

  keywords: [
    'ShafaCode',
    'software development',
    'web development',
    'mobile app development',
    'Flutter',
    'Next.js',
    'Bangladesh software company',
  ],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'ShafaCode',
    title: 'ShafaCode – Next Generation Software Development',
    description:
      'Ship modern, scalable web and mobile apps with ShafaCode – your transparent software partner.',
    images: [
      {
        // put this file in /public/images/og/main-og.png
        url: '/logo/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'ShafaCode – Next Generation Software Development',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ShafaCode – Next Generation Software Development',
    description:
      'Ship modern, scalable web and mobile apps with ShafaCode – your transparent software partner.',
    images: ['/logo/logo.jpg'],
    // site: '@your_handle',
    // creator: '@your_handle',
  },

  alternates: {
    canonical: '/',
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/fav.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${instrument.variable} bg-surface text-white antialiased`}>
        <Navbar />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
