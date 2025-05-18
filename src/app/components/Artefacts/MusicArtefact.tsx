// Exemple pour : src/components/Artefacts/MusicArtefact.tsx
import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface MusicArtefactProps {
  musicImageUrl?: string | StaticImageData;
  altText?: string;
  width: string | number;
  height: string | number;
  onClick?: () => void;   // Optionnel
  className?: string;     // Optionnel
}

const MusicArtefact: React.FC<MusicArtefactProps> = ({
  musicImageUrl = "/musique.png",
  altText = "Artefact musique",
  width,
  height,
  onClick,
  className,
}) => {
  return (
    <div 
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative', 
        cursor: onClick ? 'pointer' : 'default',
      }} 
      onClick={onClick}
      className={className}
    >
      {musicImageUrl && (
        <Image
          src={musicImageUrl}
          alt={altText || "Musique"}
          layout="fill"
          objectFit="contain"
        />
      )}
    </div>
  );
};

export default MusicArtefact;