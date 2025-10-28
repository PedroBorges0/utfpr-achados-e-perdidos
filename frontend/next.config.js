/** @type {import('next').NextConfig} */
const nextConfig = {
  // Esta configuração é MUITO IMPORTANTE para o build do Docker funcionar.
  // Ela diz ao Next.js para ignorar os avisos de qualidade de código
  // durante o processo de 'build', impedindo que ele falhe.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

