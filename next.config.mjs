/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "*.pexels.com" },
      { protocol: "https", hostname: "*.unsplash.com" },

      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "cdn.discordapp.com" },

      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
