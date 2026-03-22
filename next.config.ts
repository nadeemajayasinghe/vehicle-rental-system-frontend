import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/payments/:path*",
        destination: "http://payment-service-alb-1941616499.ap-south-1.elb.amazonaws.com/payments/:path*",
      },
    ];
  },
};

export default nextConfig;
