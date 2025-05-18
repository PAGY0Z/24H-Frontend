// src/components/Artefacts/VideoArtefact.js
import React from 'react';
import Image from 'next/image';

// IMPORTANT : Ajustez ces valeurs en pourcentage pour définir
// la position et la taille de l'écran de la miniature
// à l'intérieur de votre image video.png.
// Par exemple, si l'écran commence à 10% du haut et de la gauche,
// et fait 80% de la largeur et de la hauteur du cadre video.png.
const MINIATURE_VIDEO_STYLE = {
  position: 'absolute',
  top: '10%', // À ajuster (ex: '12.5%')
  left: '15%', // À ajuster (ex: '10.5%')
  width: '70%', // À ajuster (ex: '79%')
  height: '75%', // À ajuster (ex: '75%')
  overflow: 'hidden', // Pour que la miniature ne dépasse pas
  // borderRadius: '8px', // Optionnel: si l'écran dans video.png a des coins arrondis
};

const VideoArtefact = ({ 
  thumbnailUrl, 
  videoFrameUrl = "/video.png", // Chemin vers votre image de cadre vidéo
  altText = "Artefact vidéo", 
  width, // Largeur totale du composant
  height, // Hauteur totale du composant
  onClick, // Fonction optionnelle pour gérer les clics
  className // Classes CSS optionnelles pour plus de personnalisation
}) => {
  return (
    <div 
      style={{ 
        position: 'relative', 
        width: width || '100%', // Utilise la largeur fournie ou 100% par défaut
        height: height || 'auto', // Utilise la hauteur fournie ou auto par défaut
        aspectRatio: width && height ? undefined : '16/9', // Maintient un ratio si seulement une dimension ou aucune n'est fournie
        cursor: onClick ? 'pointer' : 'default',
      }} 
      onClick={onClick}
      className={className}
    >
      {/* Image du cadre (video.png) */}
      <Image
        src={videoFrameUrl}
        alt={`${altText} - Cadre`}
        layout="fill" // Remplit le conteneur div
        objectFit="contain" // S'assure que tout le cadre est visible, ou "cover" si vous préférez
        priority // Optionnel: si cette image est critique pour le LCP
      />
      {/* Miniature de la vidéo par-dessus le cadre */}
      <div style={MINIATURE_VIDEO_STYLE}>
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={`${altText} - Miniature`}
            layout="fill" // Remplit la zone définie par MINIATURE_VIDEO_STYLE
            objectFit="cover" // La miniature doit couvrir sa zone
          />
        )}
      </div>
    </div>
  );
};

export default VideoArtefact;