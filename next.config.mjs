/** @type {import('next').NextConfig} */
//add greenview.oss-eu-central-1.aliyuncs.com
const nextConfig = {
  images: {
    domains: ['greenview.oss-eu-central-1.aliyuncs.com'],
  },
  reactStrictMode: false,
};

export default nextConfig;
