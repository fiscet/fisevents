/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000'
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
    serverComponentsExternalPackages: ['react-data-table-component']
  }
};

export default nextConfig;
