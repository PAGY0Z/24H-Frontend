// src/components/Artefacts/MusicArtefact.js
import React from 'react';
import Image from 'next/image';

const MusicArtefact = ({ 
  musicImageUrl = "/musique.png", // Chemin vers votre image musique.png
  altText = "Artefact musique", 
  width, 
  height, 
  onClick,
  className 
}) => {
  return (
    <div 
      style={{ 
        width: width || '100px', // Taille par défaut, à ajuster
        height: height || '100px', // Taille par défaut, à ajuster
        position: 'relative', // Nécessaire pour layout="fill" sur l'Image Next.js
        cursor: onClick ? 'pointer' : 'default',
      }} 
      onClick={onClick}
      className={className}
    >
      <Image
        src={musicImageUrl}
        alt={altText}
        layout="fill" // Remplit le div parent
        objectFit="contain" // S'assure que toute l'image est visible et garde son ratio
        priority
      />
    </div>
  );
};

export default MusicArtefact;