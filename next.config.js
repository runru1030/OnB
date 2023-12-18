/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === "production",
  },
  transpilePackages: ["jotai-devtools"],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    remotePatterns: [
      { hostname: "*", protocol: "http" },
      { hostname: "*", protocol: "https" },
    ],
  },
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        destination: "https://www.koreaexim.go.kr/:path*",
        source: "/koreaxim/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
