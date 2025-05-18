// Exemple pour : src/components/Artefacts/PhotoArtefact.tsx

import React from 'react';
import Image, { StaticImageData } from 'next/image'; // StaticImageData pour un meilleur typage

// Vos styles pour le positionnement interne (inchangés)
const PHOTO_INTERIEUR_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: '8%',    // À ajuster
  left: '10%',  // À ajuster
  width: '80%', // À ajuster
  height: '82%',// À ajuster
  overflow: 'hidden',
};

// MODIFIÉ: Définition des props
interface PhotoArtefactProps {
  photoUrl?: string | StaticImageData; // Rendu optionnel si le cadre peut être seul
  photoFrameUrl?: string | StaticImageData; // Déjà optionnel avec une valeur par défaut
  altText?: string;
  width: string | number; // Permettre string (ex: "100px") ou number (pour Next/Image)
  height: string | number;
  onClick?: () => void;   // MODIFIÉ: Rendu optionnel avec '?' et typé correctement
  className?: string;     // MODIFIÉ: Rendu optionnel avec '?'
}

const PhotoArtefact: React.FC<PhotoArtefactProps> = ({
  photoUrl,
  photoFrameUrl = "/cadre_photo.png", // Valeur par défaut
  altText = "Artefact photo",        // Valeur par défaut
  width,
  height,
  onClick,  // Maintenant optionnel
  className // Maintenant optionnel
}) => {
  return (
    <div
      style={{
        position: 'relative',
        // Convertit width/height en string avec 'px' si ce sont des nombres, sinon utilise la valeur telle quelle
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick} // Utilise le onClick fourni s'il existe
      className={className} // Applique la className fournie s'il elle existe
    >
      {/* Image du cadre (cadre_photo.png) */}
      {photoFrameUrl && ( // Afficher seulement si photoFrameUrl est fourni
        <Image
          src={photoFrameUrl}
          alt={altText ? `${altText} - Cadre` : "Cadre photo"}
          layout="fill"
          objectFit="contain"
          priority // Optionnel
        />
      )}
      {/* Photo réelle par-dessus le cadre */}
      <div style={PHOTO_INTERIEUR_STYLE}>
        {photoUrl && ( // Afficher seulement si photoUrl est fourni
          <Image
            src={photoUrl}
            alt={altText || "Photo"} // S'assure qu'alt a toujours une valeur string
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
    </div>
  );
};

export default PhotoArtefact;