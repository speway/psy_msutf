import type { NextConfig } from "next";

const localizedRoutes = [
  "publications",
  "glossary",
  "roadmap",
  "archive",
  "contacts",
  "disciplines",
  "history",
  "hymn",
  "people",
  "projects",
  "timeline",
  "department",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn4.telesco.pe",
      },
    ],
  },
  devIndicators: false,
  poweredByHeader: false,
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/ru",
        permanent: false,
      },
      {
        source: "/posts/:path*",
        destination: "/ru/posts/:path*",
        permanent: true,
      },
      ...localizedRoutes.map((route) => ({
        source: `/${route}`,
        destination: `/ru/${route}`,
        permanent: true,
      })),
      ...localizedRoutes.map((route) => ({
        source: `/${route}/:path*`,
        destination: `/ru/${route}/:path*`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
