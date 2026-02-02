import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";
import ClientShell from "@/components/client/client-shell";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shafacode.com"),

  title: {
    default: "ShafaCode – Transparent Software Partner",
    template: "%s | ShafaCode",
  },
  description:
    "ShafaCode helps startups and businesses build high-quality web, mobile, and software products.",

  keywords: [
    "ShafaCode",
    "software development",
    "web development",
    "mobile app development",
    "Flutter",
    "Next.js",
    "Bangladesh software company",
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ShafaCode",
    title: "ShafaCode – Transparent Software Partner",
    description:
      "Ship modern, scalable web and mobile apps with ShafaCode – your transparent software partner.",
    images: [
      {
        // put this file in /public/images/og/main-og.png
        url: "/logo/logo.jpg",
        width: 1200,
        height: 630,
        alt: "ShafaCode – Transparent Software Partner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ShafaCode – Transparent Software Partner",
    description:
      "Ship modern, scalable web and mobile apps with ShafaCode – your transparent software partner.",
    images: ["/logo/logo.jpg"],
    // site: '@your_handle',
    // creator: '@your_handle',
  },

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/fav.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}  antialiased`}>
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
