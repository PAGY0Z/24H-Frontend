"use client";

import React, { useState, useEffect, CSSProperties, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// AJOUTÉ: Importation des composants d'artefacts
// Ajustez ces chemins si vos composants sont dans un autre dossier.
import VideoArtefact from '@/app/components/Artefacts/VideoArtefact';
import PhotoArtefact from '@/app/components/Artefacts/PhotoArtefact';
import MusicArtefact from '@/app/components/Artefacts/MusicArtefact';

// AJOUTÉ: Types pour les données des artefacts
type ArtefactType = 'video' | 'photo' | 'audio';

interface PodiumArtefactData {
  id: string | number;
  type: ArtefactType;
  title?: string;
  thumbnailUrl?: string; // Pour Vidéo
  photoUrl?: string;    // Pour Photo
  musicImageUrl?: string; // Pour Audio
  // Les informations de position et de taille sont maintenant codées en dur dans le JSX
}

// Définissez votre résolution de design de référence ici.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080; // 16:9 ratio

// Fonctions utilitaires
const scaleToWidth = (originalPx: number, currentSceneWidth: number): number => {
  return (originalPx / DESIGN_WIDTH) * currentSceneWidth;
};

// État initial du style de la scène
const initialSceneStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  backgroundImage: "url('/background_positif.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

// Données simulées pour les 3 artefacts du podium
// Ces données ne contiennent PLUS la position ni la taille.
const topArtefactsDataExample: PodiumArtefactData[] = [
  { // Données pour la 1ère place
    id: 'podium_artefact_1_data',
    type: 'video',
    title: 'Chef d\'œuvre Vidéo',
    thumbnailUrl: '/placeholder_video_thumb.jpg',
  },
  { // Données pour la 2ème place
    id: 'podium_artefact_2_data',
    type: 'photo',
    title: 'Photographie Épique',
    photoUrl: '/placeholder_photo.jpg',
  },
  { // Données pour la 3ème place
    id: 'podium_artefact_3_data',
    type: 'audio',
    title: 'Son Mémorable',
    musicImageUrl: '/musique.png',
  },
];


export default function PodiumClient() { // Le nom du fichier est ArtefactsClient.tsx dans votre code
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);
  const [sceneStyle, setSceneStyle] = useState<CSSProperties>(initialSceneStyle);
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);

  // MODIFIÉ: État pour stocker les données des artefacts, initialisé avec l'exemple
  const [topArtefacts, setTopArtefacts] = useState<PodiumArtefactData[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const aspectRatio = DESIGN_WIDTH / DESIGN_HEIGHT;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight;
      const windowRatio = newWidth / newHeight;

      if (windowRatio > aspectRatio) {
        newHeight = window.innerHeight;
        newWidth = newHeight * aspectRatio;
      } else {
        newWidth = window.innerWidth;
        newHeight = newWidth / aspectRatio;
      }
      setCurrentSceneWidth(newWidth);
      const newStyles: CSSProperties = {
        ...initialSceneStyle,
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      };
      setSceneStyle(newStyles);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Simuler le chargement des données des artefacts (vous remplacerez par votre appel API)
    // Pour l'instant, nous utilisons les données d'exemple définies ci-dessus.
    setTopArtefacts(topArtefactsDataExample);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dynamicFontSize = (originalPxSize: number): string => {
    return `${scaleToWidth(originalPxSize, currentSceneWidth)}px`;
  };

  const dynamicSize = (originalPxSize: number): string => {
    return `${scaleToWidth(originalPxSize, currentSceneWidth)}px`;
  };

  const handleReturn = () => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  const handlePodiumArtefactClick = (artefactId: string | number) => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push(`/artefact_show?id=${artefactId}`);
    }, 600);
  };

  // Valeurs de design originales
  const buttonPaddingX = 25;
  const buttonPaddingY = 8;
  const buttonFontSize = 25;
  const buttonMarginBottom = 70;

  const podiumImageOriginalWidth = 1000;
  const podiumImageOriginalHeight = 467; // IMPORTANT: Doit correspondre au ratio de votre image
  const podiumButtonGap = -43;

  // Fonction pour rendre un artefact spécifique basé sur ses données
  const renderArtefact = (artefactData: PodiumArtefactData, widthStyle: string, heightStyle: string): ReactNode => {
    if (!artefactData) return null;

    switch (artefactData.type) {
      case 'video':
        return (
          <VideoArtefact
            thumbnailUrl={artefactData.thumbnailUrl}
            width={widthStyle}
            height={heightStyle}
            altText={artefactData.title || 'Vidéo du podium'}
          />
        );
      case 'photo':
        return (
          <PhotoArtefact
            photoUrl={artefactData.photoUrl}
            width={widthStyle}
            height={heightStyle}
            altText={artefactData.title || 'Photo du podium'}
          />
        );
      case 'audio':
        return (
          <MusicArtefact
            musicImageUrl={artefactData.musicImageUrl}
            width={widthStyle} // Pour l'audio, heightStyle pourrait être égal à widthStyle pour un carré
            height={heightStyle}
            altText={artefactData.title || 'Audio du podium'}
          />
        );
      default: return null;
    }
  };

  // Récupérer les données pour chaque position (s'assurer qu'elles existent)
  const firstPlaceArtefactData = topArtefacts[0];
  const secondPlaceArtefactData = topArtefacts[1];
  const thirdPlaceArtefactData = topArtefacts[2];

  // Définir les tailles de design originales pour chaque position (en pixels de design)
  // VOUS MODIFIEZ CES VALEURS POUR CHANGER LA TAILLE DES ARTEFACTS SUR LE PODIUM
  const firstPlaceSizePx = { width: 220, height: (220 / 67) * 92 }; // Maintient le ratio 67:92
  const secondPlaceSizePx = { width: 180, height: (180 / 67) * 92 };
  const thirdPlaceSizePx = { width: 150, height: (150 / 67) * 92 }; // Pour l'audio, vous pourriez vouloir une hauteur = largeur


  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      <div className="relative">
        <AnimatePresence mode="wait">
          {isLeaving && (
            <motion.div
              className="fixed inset-0 bg-black z-[999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}

          <motion.div
            key="podium-page-content"
            style={{
              ...sceneStyle,
              justifyContent: 'flex-end',
            }}
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                position: 'relative',
                width: dynamicSize(podiumImageOriginalWidth),
                marginBottom: dynamicSize(podiumButtonGap),
              }}
            >
              <Image
                src="/podium.png"
                alt="Podium"
                width={podiumImageOriginalWidth}
                height={podiumImageOriginalHeight}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />

              {/* ARTEFACT 1ère PLACE - Position et taille codées en dur */}
              {firstPlaceArtefactData && (
                <motion.div
                  key={firstPlaceArtefactData.id + "-podium"}
                  className="hover:scale-110 transition-transform transform-gpu cursor-pointer"
                  style={{
                    position: 'absolute',
                    // MODIFIEZ CES VALEURS POUR LA POSITION DE LA 1ÈRE PLACE
                    top: '-50%',     // Exemple: 10% du haut du conteneur podium
                    left: '38%',    // Exemple: 50% de la gauche
                    transform: 'translateX(-50%)', // Pour centrer horizontalement
                    width: dynamicSize(firstPlaceSizePx.width),
                    // La hauteur est gérée par le composant artefact via ses props width/height
                    zIndex: 3,      // Pour être au-dessus des autres
                  }}
                  onClick={() => handlePodiumArtefactClick(firstPlaceArtefactData.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }} // Délai légèrement plus long pour le gagnant
                >
                  {renderArtefact(firstPlaceArtefactData, dynamicSize(firstPlaceSizePx.width), dynamicSize(firstPlaceSizePx.height))}
                </motion.div>
              )}

              {/* ARTEFACT 2ème PLACE - Position et taille codées en dur */}
              {secondPlaceArtefactData && (
                <motion.div
                  key={secondPlaceArtefactData.id + "-podium"}
                  className="hover:scale-110 transition-transform transform-gpu cursor-pointer"
                  style={{
                    position: 'absolute',
                    // MODIFIEZ CES VALEURS POUR LA POSITION DE LA 2ÈME PLACE
                    top: '-13%',     // Exemple
                    left: '14%',    // Exemple
                    width: dynamicSize(secondPlaceSizePx.width),
                    zIndex: 2,
                  }}
                  onClick={() => handlePodiumArtefactClick(secondPlaceArtefactData.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  {renderArtefact(secondPlaceArtefactData, dynamicSize(secondPlaceSizePx.width), dynamicSize(secondPlaceSizePx.height))}
                </motion.div>
              )}

              {/* ARTEFACT 3ème PLACE - Position et taille codées en dur */}
              {thirdPlaceArtefactData && (
                <motion.div
                  key={thirdPlaceArtefactData.id + "-podium"}
                  className="hover:scale-110 transition-transform transform-gpu cursor-pointer"
                  style={{
                    position: 'absolute',
                    // MODIFIEZ CES VALEURS POUR LA POSITION DE LA 3ÈME PLACE
                    top: '0%',     // Exemple
                    left: '68%',    // Exemple
                    // Pour un artefact audio carré, vous pourriez vouloir que la hauteur soit égale à la largeur
                    width: dynamicSize(thirdPlaceSizePx.width),
                    zIndex: 1,
                  }}
                  onClick={() => handlePodiumArtefactClick(thirdPlaceArtefactData.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  {renderArtefact(
                    thirdPlaceArtefactData,
                    dynamicSize(thirdPlaceSizePx.width),
                    // Si c'est audio et que vous voulez un carré: dynamicSize(thirdPlaceSizePx.width)
                    // Sinon, pour maintenir le ratio 67:92 (ou autre défini dans le composant) :
                    dynamicSize(thirdPlaceSizePx.height)
                  )}
                </motion.div>
              )}
            </div>

            <div
              className="text-center mr-230"
              style={{ marginBottom: dynamicSize(buttonMarginBottom), width: '100%' }}
            >
              <button
                onClick={handleReturn}
                className="bg-[#8B4513] hover:bg-[#5C3210] font-bold text-white rounded-full transition"
                style={{
                  fontFamily: "'Faculty Glyphic', serif",
                  fontSize: dynamicFontSize(buttonFontSize),
                  paddingLeft: dynamicSize(buttonPaddingX),
                  paddingRight: dynamicSize(buttonPaddingX),
                  paddingTop: dynamicSize(buttonPaddingY),
                  paddingBottom: dynamicSize(buttonPaddingY),
                }}
              >
                BACK TO HOME
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
