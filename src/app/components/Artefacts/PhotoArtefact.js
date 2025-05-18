// src/components/Artefacts/PhotoArtefact.js
import React from 'react';
import Image from 'next/image';

// IMPORTANT : Ajustez ces valeurs en pourcentage pour définir
// la position et la taille de la zone où la photo sera affichée
// à l'intérieur de votre image cadre_photo.png.
const PHOTO_INTERIEUR_STYLE = {
  position: 'absolute',
  top: '8%',    // À ajuster
  left: '10%',  // À ajuster
  width: '80%', // À ajuster
  height: '82%',// À ajuster
  overflow: 'hidden',
  // boxShadow: 'inset 0 0 3px rgba(0,0,0,0.4)', // Optionnel: pour un effet de profondeur
};

const PhotoArtefact = ({ 
  photoUrl, 
  photoFrameUrl = "/cadre_photo.png", // Chemin vers votre image de cadre photo
  altText = "Artefact photo", 
  width, 
  height, 
  onClick,
  className 
}) => {
  return (
    <div 
      style={{ 
        position: 'relative', 
        width: width || '100%',
        height: height || 'auto',
        aspectRatio: width && height ? undefined : '4/3', // Ratio typique pour photos, ajustez au besoin
        cursor: onClick ? 'pointer' : 'default',
      }} 
      onClick={onClick}
      className={className}
    >
      {/* Image du cadre (cadre_photo.png) */}
      <Image
        src={photoFrameUrl}
        alt={`${altText} - Cadre`}
        layout="fill"
        objectFit="contain" // ou "cover"
        priority 
      />
      {/* Photo réelle par-dessus le cadre */}
      <div style={PHOTO_INTERIEUR_STYLE}>
        {photoUrl && (
          <Image
            src={photoUrl}
            alt={altText}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
    </div>
  );
};

export default PhotoArtefact;