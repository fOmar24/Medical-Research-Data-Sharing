/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    
    // Sui blockchain
    SUI_RPC_URL: process.env.SUI_RPC_URL || 'https://fullnode.mainnet.sui.io',
    SUI_NETWORK: process.env.SUI_NETWORK || 'mainnet',
    
    // Walrus storage
    WALRUS_API_KEY: process.env.WALRUS_API_KEY,
    WALRUS_ENDPOINT: process.env.WALRUS_ENDPOINT || 'https://api.walrus-storage.network',
  },
  
  // Enable server actions
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
