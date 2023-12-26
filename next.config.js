/* eslint-disable */
/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const config = {
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
      {
        protocol: "https",
        hostname: "opendata.mofa.go.kr",
        port: "8444",
        pathname: "/fileDownload/images/country_images/flags/**",
      },
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

const nextConfig = withPWA({
  dest: "public",
  runtimeCaching: [],
})(config);

module.exports = config;
