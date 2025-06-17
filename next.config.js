import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: [
      "media.alsaadhome.com",
      "stagingapp.alsaadhome.com",
      "encrypted-tbn0.gstatic.com",
      "img.youtube.com",
      "http://192.168.1.6",
      "png.pngtree.com",
      "staging.alsaadhome.com",
      "d1tv1hwh9wfb3x.cloudfront.net",
      "png.pngtree.com",
      "cdn.pixabay.com",
      "https://d1tv1hwh9wfb3x.cloudfront.net",
    ],
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  // },
};

export default withNextIntl(nextConfig);
