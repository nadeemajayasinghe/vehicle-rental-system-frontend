import type { NextConfig } from "next";

const ALB = "http://api-gateway-alb-1602792189.eu-north-1.elb.amazonaws.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/payments/:path*",
        destination: `${ALB}/payments/:path*`,
      },
      {
        source: "/api/bookings/:path*",
        destination: `${ALB}/api/bookings/:path*`,
      },
    ];
  },
};

export default nextConfig;
