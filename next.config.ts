import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  reactStrictMode: true, // ou toute autre configuration que vous pourriez avoir
  images: {
    remotePatterns: [
      {
        protocol: 'https', // J'ai mis 'https' car c'est plus courant, mais si votre URL est bien en 'http', utilisez 'http'
        hostname: 'qwerteam.lareunion.webcup.hodi.host',
        port: '', // Laissez vide pour les ports par défaut (80 pour http, 443 pour https)
        pathname: '/uploads/**', // Autorise toutes les images dans ce chemin et ses sous-dossiers
      },
      // Vous pouvez ajouter d'autres configurations de domaines ici si nécessaire
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
