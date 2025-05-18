// Exemple pour : src/components/Artefacts/VideoArtefact.tsx
import React from 'react';
import Image, { StaticImageData } from 'next/image';

const MINIATURE_VIDEO_STYLE: React.CSSProperties = { /* ... vos styles ... */ };

interface VideoArtefactProps {
  thumbnailUrl?: string | StaticImageData;
  videoFrameUrl?: string | StaticImageData;
  altText?: string;
  width: string | number;
  height: string | number;
  onClick?: () => void;   // Optionnel
  className?: string;     // Optionnel
}

const VideoArtefact: React.FC<VideoArtefactProps> = ({
  thumbnailUrl,
  videoFrameUrl = "/video.png",
  altText = "Artefact vidéo",
  width,
  height,
  onClick,
  className,
}) => {
  return (
    <div 
      style={{ 
        position: 'relative', 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        cursor: onClick ? 'pointer' : 'default',
      }} 
      onClick={onClick}
      className={className}
    >
      {videoFrameUrl && (
        <Image
          src={videoFrameUrl}
          alt={altText ? `${altText} - Cadre` : "Cadre vidéo"}
          layout="fill"
          objectFit="contain"
        />
      )}
      <div style={MINIATURE_VIDEO_STYLE}>
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={altText ? `${altText} - Miniature` : "Miniature vidéo"}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
    </div>
  );
};

export default VideoArtefact;