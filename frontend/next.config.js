// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ESTA LINHA É OBRIGATÓRIA PARA QUE O DOMÍNIO EXTERNO SEJA RECONHECIDO!
    domains: ['via.placeholder.com'], 
  },
};

module.exports = nextConfig;