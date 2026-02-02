import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "ocectkchrhtbvthhwbtc.supabase.co", // Supabase
      "res.cloudinary.com",              // Cloudinary
    ],
  },
};

export default nextConfig;
