// next.config.js (SOLUÇÃO FINAL PARA IMAGENS)

// next.config.js (Obrigatório)
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, 
    domains: ['via.placeholder.com', 'localhost'], // Adicionado localhost para segurança
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000', // Libera o acesso ao backend
      },
    ],
  },
};
module.exports = nextConfig;

