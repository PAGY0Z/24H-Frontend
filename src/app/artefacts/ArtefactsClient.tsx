"use client";

import React, { useState, useEffect, CSSProperties, ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// Importation des composants d'artefacts
import VideoArtefact from '@/app/components/Artefacts/VideoArtefact';
import PhotoArtefact from '@/app/components/Artefacts/PhotoArtefact';
import MusicArtefact from '@/app/components/Artefacts/MusicArtefact';

// Types pour les données des artefacts
type ArtefactType = 'video' | 'photo' | 'audio';

interface ApiArtefactItem {
  id: string | number;
  votecount?: number;
  author?: string;
  title?: string;
  description?: string;
  isNegative?: boolean;
  isPositive?: boolean;
  emoji?: string;
  artyfactType: string;
  filepath: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ArtefactDataItem {
  id: string | number;
  type: ArtefactType;
  title?: string;
  thumbnailUrl?: string;
  photoUrl?: string;
  musicImageUrl?: string;
}

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const BACKEND_ASSET_BASE_URL = "https://backend.qwerteam.lareunion.webcup.hodi.host";

const scaleToWidth = (originalPx: number, currentSceneWidth: number): number => {
  return (originalPx / DESIGN_WIDTH) * currentSceneWidth;
};

const initialSceneStyle: CSSProperties = {
  position: "relative", // Important for positioning children absolutely within this scene
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
  const email = searchParams.get("email");
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);
  const [sceneStyle, setSceneStyle] = useState<CSSProperties>(initialSceneStyle);
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);
  const [isRightHovered, setIsRightHovered] = useState(false);
  const [artefactsToDisplay, setArtefactsToDisplay] = useState<ArtefactDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const loadArtefacts = async () => {
      if (!email || email === "Inconnu") {
        setError("Auteur (email) non spécifié dans l'URL.");
        setIsLoading(false);
        setArtefactsToDisplay([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_ASSET_BASE_URL}/api/artifacts/randoms/${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
        }
        const rawData: ApiArtefactItem[] | null = await response.json();
        if (!rawData || rawData.length === 0) {
          setArtefactsToDisplay([]);
        } else {
          const transformedData = rawData.map((item: ApiArtefactItem) => {
            const artefactType = item.artyfactType.toLowerCase() as ArtefactType;
            let imageUrl: string | undefined = undefined;
            if (item.filepath) {
              if (item.filepath.startsWith('http://') || item.filepath.startsWith('https://')) {
                imageUrl = item.filepath;
              } else {
                const path = item.filepath.startsWith('/') ? item.filepath : `/${item.filepath}`;
                imageUrl = `${BACKEND_ASSET_BASE_URL}${path}`;
              }
            }
            const dataItem: ArtefactDataItem = { id: item.id, title: item.title, type: artefactType };
            switch (artefactType) {
              case 'video': dataItem.thumbnailUrl = imageUrl; break;
              case 'photo': dataItem.photoUrl = imageUrl; break;
              case 'audio': dataItem.musicImageUrl = imageUrl; break;
            }
            return dataItem;
          });
          setArtefactsToDisplay(transformedData);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des artefacts:", err);
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
        setArtefactsToDisplay([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadArtefacts();
    return () => window.removeEventListener("resize", handleResize);
  }, [email]);

  const dynamicFontSize = (originalPxSize: number): string => scaleToWidth(originalPxSize, currentSceneWidth) + 'px';
  const dynamicSize = (originalPxSize: number): string => scaleToWidth(originalPxSize, currentSceneWidth) + 'px';

  const handleReturn = () => {
    setIsLeaving(true);
    setTimeout(() => router.push("/"), 600);
  };

  const handleItemClick = (itemId: string | number) => {
    setIsLeaving(true);
    setTimeout(() => router.push(`/artefact_show?id=${itemId}`), 600);
  };

  const handleGlobalAddClick = () => {
    setIsLeaving(true);
    setTimeout(() => router.push('/artefact_add'), 600);
  };

  // MODIFIÉ: Handler pour le clic sur le panneau droit (reload)
  const handlePanelReloadClick = () => {
    setIsLeaving(true);
    setTimeout(() => {
      window.location.reload();
    }, 600); // Match animation duration
  };


  // Design constants
  const titleMarginTop = 185;
  const gridGap = 80;
  const itemOriginalWidthPx = 280;
  const itemOriginalHeightPx = (itemOriginalWidthPx / 67) * 92;
  const buttonPaddingX = 24;
  const buttonPaddingY = 8;
  const buttonMarginBottom = 90;

  const globalPlusButtonSizePx = 150;
  const globalPlusIconSizePx = 100;
  const globalPlusButtonRightMarginPx = 130;
  
  const rightPanelWidthPx = 350;
  const rightPanelRightMarginPx = 100;
  const rightPanelBottomMarginPx = 50;


  const gridSlots = Array.from({ length: 4 });

  let mainContent;
  if (isLoading) {
    mainContent = (
      <div className="flex-grow flex justify-center items-center text-white text-2xl" style={{ fontFamily: "'Faculty Glyphic', serif" }}>
        Chargement des artefacts...
      </div>
    );
  } else if (error) {
    mainContent = (
      <div className="flex-grow flex justify-center items-center text-red-500 p-4 text-center" style={{ fontFamily: "'Faculty Glyphic', serif", fontSize: dynamicFontSize(24) }}>
        Erreur: {error}
      </div>
    );
  } else if (artefactsToDisplay.length === 0) {
    mainContent = (
      <div className="flex-grow flex justify-center items-center text-black p-4 text-center" style={{ fontFamily: "'Faculty Glyphic', serif", fontSize: dynamicFontSize(28) }}>
        Aucun artefact trouvé pour cet auteur.
      </div>
    );
  } else {
    mainContent = (
      <div className="flex justify-center mr-50 mb-33"> {/* mr-50, mb-33 classes personnalisées? */}
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
                  artefactComponent = <VideoArtefact thumbnailUrl={artefact.thumbnailUrl} videoFrameUrl="/video.png" width={itemWidth} height={itemHeight} altText={artefact.title || 'Vidéo'} />;
                  break;
                case 'photo':
                  artefactComponent = <PhotoArtefact photoUrl={artefact.photoUrl} photoFrameUrl="/cadre_photo.png" width={itemWidth} height={itemHeight} altText={artefact.title || 'Photo'} />;
                  break;
                case 'audio':
                  artefactComponent = <MusicArtefact musicImageUrl={artefact.musicImageUrl || "/musique.png"} width={itemWidth} height={itemHeight} altText={artefact.title || 'Audio'} />;
                  break;
                default:
                  // This case should ideally not be reached if artefact.type is correctly typed and handled
                  const _exhaustiveCheck: never = artefact.type; 
                  console.warn("Type d'artefact non géré dans la grille:", _exhaustiveCheck);
                  artefactComponent = <div style={{color: 'orange', width: '100%', height: '100%', display:'flex', alignItems:'center', justifyContent:'center', border: '1px dashed orange'}}>Type non supporté: {artefact.type}</div>;
              }
              return (
                <div key={artefact.id} className="hover:scale-105 transition transform-gpu cursor-pointer" style={{ width: itemWidth, height: itemHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleItemClick(artefact.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleItemClick(artefact.id); }}>
                  {artefactComponent}
                </div>
              );
            } else {
              return <div key={`empty-slot-${index}`} style={{ width: itemWidth, height: itemHeight }} />;
            }
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
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
          key="artefacts-page-content"
          style={sceneStyle} 
          className="flex flex-col justify-between" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Titre toujours visible */}
          <div
            className="flex flex-row items-baseline justify-center text-center mr-50" 
            style={{ marginTop: dynamicSize(titleMarginTop) }}
          >
            <div className="text-black font-bold" style={{ fontFamily: "Limelight, cursive", fontSize: dynamicFontSize(50), marginRight: dynamicSize(20) }}>
              ARTIFACTS :
            </div>
            <div className="text-black font-bold" style={{ fontFamily: "'Faculty Glyphic', serif", fontSize: dynamicFontSize(55) }}>
              {email || "Inconnu"}
            </div>
          </div>
          
          {/* Contenu principal (chargement, erreur, aucun artefact, ou grille) */}
          {mainContent}

          {/* Bouton Retour toujours visible en bas */}
          <div className="text-center" style={{ marginBottom: dynamicSize(buttonMarginBottom) }}>
            <button onClick={handleReturn} className="bg-[#8B4513] hover:bg-[#5C3210] font-bold text-white rounded-full transition mr-50" style={{ fontFamily: "'Faculty Glyphic', serif", fontSize: dynamicFontSize(25), padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}` }}>
              BACK TO HOME
            </button>
          </div>

          {/* Bouton "+" Global, à l'intérieur de la scène principale */}
          <button
            onClick={handleGlobalAddClick}
            aria-label="Ajouter un artefact"
            className="bg-white text-black rounded-full shadow-xl hover:bg-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-gray-300
                       flex items-center justify-center transition-transform hover:scale-110"
            style={{
              position: 'absolute', 
              top: '50%',
              right: dynamicSize(globalPlusButtonRightMarginPx), 
              transform: 'translateY(-50%)', 
              width: dynamicSize(globalPlusButtonSizePx),
              height: dynamicSize(globalPlusButtonSizePx),
              fontSize: dynamicSize(globalPlusIconSizePx),
              lineHeight: '1', 
              zIndex: 50, 
            }}
          >
            +
          </button>

          {/* Panneau Droite, à l'intérieur de la scène principale */}
          <div
            style={{
              position: 'absolute', 
              bottom: dynamicSize(rightPanelBottomMarginPx), 
              right: dynamicSize(rightPanelRightMarginPx),   
              width: dynamicSize(rightPanelWidthPx),       
              height: 'auto', 
              zIndex: 40, 
            }}
            className="bg-transparent border-none outline-none cursor-pointer"
            onMouseEnter={() => setIsRightHovered(true)}
            onMouseLeave={() => setIsRightHovered(false)}
            role="button"
            tabIndex={0}
            onClick={handlePanelReloadClick} // MODIFIÉ: Appel du nouveau handler
          >
            <Image
              src={isRightHovered ? "/panneau_suivant_hover.png" : "/panneau_suivant.png"}
              alt="Panneau action" // Changed alt text for clarity
              layout="responsive" 
              width={350} 
              height={100} 
              className="transition"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
