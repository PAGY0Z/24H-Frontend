"use client";

import React, { useState, useEffect, CSSProperties, ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// AJOUTÉ: Importation des composants d'artefacts
// UTILISATION DE CHEMINS RELATIFS:
// Suppose que ArtefactsClient.tsx est dans src/app/artefacts/
// et que vos composants sont dans src/components/Artefacts/
// Ajustez si votre structure de dossiers est différente.
// L'extension (.js ou .tsx) est souvent résolue automatiquement par Next.js.
import VideoArtefact from '@/app/components/Artefacts/VideoArtefact';
import PhotoArtefact from '@/app/components/Artefacts/PhotoArtefact';
import MusicArtefact from '@/app/components/Artefacts/MusicArtefact';

// AJOUTÉ: Types pour les données des artefacts
type ArtefactType = 'video' | 'photo' | 'audio';

interface ArtefactDataItem {
  id: string | number; // ID unique pour la key et la navigation
  type: ArtefactType;
  title?: string;
  thumbnailUrl?: string; // Pour les vidéos
  photoUrl?: string;    // Pour les photos
  musicImageUrl?: string; // Optionnel pour la musique si vous ne voulez pas le défaut
}

// Définissez votre résolution de design de référence ici.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080; // 16:9 ratio

// Fonctions utilitaires (inchangées)
const pxToPercentWidth = (px: number): number => (px / DESIGN_WIDTH) * 100;
const pxToPercentHeight = (px: number): number => (px / DESIGN_HEIGHT) * 100;
const scaleToWidth = (originalPx: number, currentSceneWidth: number): number => {
  return (originalPx / DESIGN_WIDTH) * currentSceneWidth;
};

const initialSceneStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  backgroundImage: "url('/background_positif.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

export default function ArtefactsClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "Inconnu";
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);

  const [sceneStyle, setSceneStyle] = useState<CSSProperties>(initialSceneStyle);
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);
  const [isRightHovered, setIsRightHovered] = useState(false);

  const [artefactsToDisplay, setArtefactsToDisplay] = useState<ArtefactDataItem[]>([]);

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

    const loadArtefacts = () => {
      const fetchedArtefacts: ArtefactDataItem[] = [
        { id: 'artefact1', type: 'video', title: 'Exploration Sous-Marine', thumbnailUrl: '/placeholder_video_thumb.jpg' },
        { id: 'artefact2', type: 'photo', title: 'Paysage Lunaire', photoUrl: '/placeholder_photo.jpg' },
        { id: 'artefact3', type: 'audio', title: 'Symphonie des Étoiles' },
      ];
      setArtefactsToDisplay(fetchedArtefacts);
    };
    loadArtefacts();

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

  const handleItemClick = (itemId: string | number) => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push(`/artefact_show?id=${itemId}`);
    }, 600);
  };

  const handleGlobalAddClick = () => {
    console.log("Bouton + Global cliqué");
    setIsLeaving(true);
    setTimeout(() => {
      router.push('/artefact_add');
    }, 600);
  };

  const titleMarginTop = 185;
  const gridGap = 80;
  const itemOriginalWidthPx = 280;
  const itemOriginalHeightPx = (itemOriginalWidthPx / 67) * 92;

  const buttonPaddingX = 24;
  const buttonPaddingY = 8;
  const buttonMarginBottom = 90;

  const globalPlusButtonSize = 150;
  const globalPlusIconSize = 120;

  const gridSlots = Array.from({ length: 4 });

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      <div className="relative">
        <AnimatePresence mode="wait">
          <>
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
              key="artefacts-page-content"
              style={sceneStyle}
              className="flex flex-col justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="flex flex-row items-baseline justify-center text-center mr-50"
                style={{ marginTop: dynamicSize(titleMarginTop) }}
              >
                <div
                  className="text-black font-bold"
                  style={{ fontFamily: "Limelight, cursive", fontSize: dynamicFontSize(50), marginRight: dynamicSize(20) }}
                >
                  ARTIFACTS :
                </div>
                <div
                  className="text-black font-bold"
                  style={{ fontFamily: "'Faculty Glyphic', serif", fontSize: dynamicFontSize(55) }}
                >
                  {email}
                </div>
              </div>

              <div className="flex justify-center mr-50 mb-33">
                <div
                  className="grid grid-cols-4"
                  style={{ gap: dynamicSize(gridGap) }}
                >
                  {gridSlots.map((_, index) => {
                    const artefact = artefactsToDisplay[index];
                    const itemWidth = dynamicSize(itemOriginalWidthPx);
                    const itemHeight = dynamicSize(itemOriginalHeightPx);

                    if (artefact) {
                      let artefactComponent: ReactNode = null;
                      switch (artefact.type) {
                        case 'video':
                          artefactComponent = (
                            <VideoArtefact
                              thumbnailUrl={artefact.thumbnailUrl}
                              videoFrameUrl="/video.png"
                              width={itemWidth}
                              height={itemHeight}
                              altText={artefact.title || 'Vidéo'}
                            />
                          );
                          break;
                        case 'photo':
                          artefactComponent = (
                            <PhotoArtefact
                              photoUrl={artefact.photoUrl}
                              photoFrameUrl="/cadre_photo.png"
                              width={itemWidth}
                              height={itemHeight}
                              altText={artefact.title || 'Photo'}
                            />
                          );
                          break;
                        case 'audio':
                          artefactComponent = (
                            <MusicArtefact
                              musicImageUrl={artefact.musicImageUrl || "/musique.png"}
                              width={itemWidth}
                              height={itemHeight}
                              altText={artefact.title || 'Audio'}
                            />
                          );
                          break;
                        default:
                          artefactComponent = <div style={{color: 'red', width: '100%', height: '100%', display:'flex', alignItems:'center', justifyContent:'center', border: '1px dashed red'}}>Type Inconnu</div>;
                      }

                      return (
                        <div
                          key={artefact.id}
                          className="hover:scale-105 transition transform-gpu cursor-pointer"
                          style={{
                            width: itemWidth,
                            height: itemHeight,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onClick={() => handleItemClick(artefact.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleItemClick(artefact.id);
                            }
                          }}
                        >
                          {artefactComponent}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={`empty-slot-${index}`}
                          style={{
                            width: itemWidth,
                            height: itemHeight,
                          }}
                        />
                      );
                    }
                  })}
                </div>
              </div>

              <div
                className="text-center"
                style={{ marginBottom: dynamicSize(buttonMarginBottom) }}
              >
                <button
                  onClick={handleReturn}
                  className="bg-[#8B4513] hover:bg-[#5C3210] font-bold text-white rounded-full transition mr-50"
                  style={{
                    fontFamily: "'Faculty Glyphic', serif",
                    fontSize: dynamicFontSize(25),
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
          </>
        </AnimatePresence>
      </div>

      <button
        onClick={handleGlobalAddClick}
        aria-label="Ajouter un artefact"
        className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 z-50
                   bg-white text-black rounded-full shadow-xl hover:bg-gray-200 mr-20
                   focus:outline-none focus:ring-2 focus:ring-gray-300
                   flex items-center justify-center transition-transform hover:scale-110"
        style={{
          width: dynamicSize(globalPlusButtonSize),
          height: dynamicSize(globalPlusButtonSize),
          fontSize: dynamicFontSize(globalPlusIconSize),
          lineHeight: '1',
        }}
      >
        +
      </button>

      <div
              style={{
                position: 'absolute',
                bottom: `${pxToPercentHeight(100)}%`,
                right: `${pxToPercentWidth(DESIGN_WIDTH * 0.13)}%`,
                width: `${pxToPercentWidth(350)}%`,
              }}
              className="bg-transparent border-none outline-none cursor-pointer"
              onMouseEnter={() => setIsRightHovered(true)}
              onMouseLeave={() => setIsRightHovered(false)}
              role="button"
              tabIndex={0}
              onClick={() => { console.log("Panneau droite cliqué"); }}
            >
              <Image
                src={isRightHovered ? "/panneau_suivant_hover.png" : "/panneau_suivant.png"}
                alt="Panneau droite"
                layout="responsive"
                width={350} 
                height={100} 
                className="transition"
              />
            </div>
    </div>
  );
}