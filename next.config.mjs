const nextConfig = {
  /* config options here */
  images: {
    domains: [
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;
