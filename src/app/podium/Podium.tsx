"use client";

import React, { useState, useEffect, CSSProperties, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// Importation des composants d'artefacts
// Assurez-vous que ces chemins sont corrects pour votre structure de projet.
import VideoArtefact from '@/app/components/Artefacts/VideoArtefact';
import PhotoArtefact from '@/app/components/Artefacts/PhotoArtefact';
import MusicArtefact from '@/app/components/Artefacts/MusicArtefact';

// Types pour les données des artefacts
type ArtefactType = 'video' | 'photo' | 'audio';

// Interface pour un item artefact tel que retourné par l'API (dans la liste 'items')
interface ApiPodiumArtefactItem {
  id: string | number;
  votecount: number; // Important pour le classement
  author: string;
  title: string;
  description: string; 
  isNegative: boolean;
  isPositive: boolean;
  emoji: string;
  artyfactType: string; // Vient de l'API en MAJUSCULES (ex: "VIDEO")
  filepath: string | null;
  created_at?: string;
  updated_at?: string;
}

// Interface pour la réponse complète de l'API /leaderboard
interface ApiLeaderboardResponse {
  items: ApiPodiumArtefactItem[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  // ... autres champs de pagination si besoin
}

// Interface pour les données transformées utilisées par le frontend pour le podium
interface PodiumArtefactData {
  id: string | number;
  type: ArtefactType;
  title?: string;
  thumbnailUrl?: string;
  photoUrl?: string;
  musicImageUrl?: string;
}

// Définissez votre résolution de design de référence ici.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080; // 16:9 ratio

// URL de base de votre backend
const BACKEND_BASE_URL = "https://backend.qwerteam.lareunion.webcup.hodi.host";


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


export default function PodiumClient() { 
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);
  const [sceneStyle, setSceneStyle] = useState<CSSProperties>(initialSceneStyle);
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);

  // États pour les données, le chargement et les erreurs
  const [topArtefacts, setTopArtefacts] = useState<PodiumArtefactData[]>([]);
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

    // Fonction pour charger les données du leaderboard
    const loadLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch top 3 artefacts
        const response = await fetch(`${BACKEND_BASE_URL}/api/leaderboard?page=1&per_page=3`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ description: `API Error ${response.status}`}));
          throw new Error(errorData.description || `Erreur API: ${response.status} ${response.statusText}`);
        }
        const leaderboardData: ApiLeaderboardResponse = await response.json();

        if (leaderboardData && leaderboardData.items && leaderboardData.items.length > 0) {
          const transformedData = leaderboardData.items.map((item: ApiPodiumArtefactItem) => {
            const artefactType = item.artyfactType.toLowerCase() as ArtefactType;
            let imageUrl: string | undefined = undefined;

            if (item.filepath) {
              if (item.filepath.startsWith('http://') || item.filepath.startsWith('https://')) {
                imageUrl = item.filepath;
              } else {
                // Assure que le chemin commence par un '/' s'il n'en a pas déjà un
                const path = item.filepath.startsWith('/') ? item.filepath : `/${item.filepath}`;
                imageUrl = `https://qwerteam.lareunion.webcup.hodi.host${path}`; 
              }
            }
            const dataItem: PodiumArtefactData = { 
              id: item.id, 
              title: item.title, 
              type: artefactType 
            };
            switch (artefactType) {
              case 'video': dataItem.thumbnailUrl = imageUrl; break;
              case 'photo': dataItem.photoUrl = imageUrl; break;
              case 'audio': dataItem.musicImageUrl = imageUrl; break;
            }
            return dataItem;
          });
          setTopArtefacts(transformedData);
        } else {
          setTopArtefacts([]); // Pas d'items dans la réponse ou réponse vide
          // Vous pourriez vouloir définir une erreur ou un message spécifique ici si leaderboardData.items est vide
          // setError("Aucun artefact trouvé sur le leaderboard."); 
        }
      } catch (err) {
        console.error("Erreur lors du chargement du leaderboard:", err);
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
        setTopArtefacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Exécuter une seule fois au montage

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
  const podiumImageOriginalHeight = 467; 
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
            width={widthStyle} 
            height={heightStyle}
            altText={artefactData.title || 'Audio du podium'}
          />
        );
      default: 
        const _exhaustiveCheck: never = artefactData.type; // TypeScript check
        console.warn("Type d'artefact non géré dans renderArtefact:", _exhaustiveCheck);
        return null;
    }
  };

  // Récupérer les données pour chaque position
  const firstPlaceArtefactData = topArtefacts[0];
  const secondPlaceArtefactData = topArtefacts[1];
  const thirdPlaceArtefactData = topArtefacts[2];

  // Définir les tailles de design originales pour chaque position (en pixels de design)
  const firstPlaceSizePx = { width: 220, height: (220 / 67) * 92 }; 
  const secondPlaceSizePx = { width: 180, height: (180 / 67) * 92 };
  const thirdPlaceSizePx = { width: 150, height: (150 / 67) * 92 }; 


  let podiumContent;
  if (isLoading) {
    podiumContent = <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', fontSize: dynamicFontSize(30), fontFamily: "'Faculty Glyphic', serif", textAlign: 'center', padding: dynamicSize(50)}}>Chargement du Podium...</div>;
  } else if (error) {
    podiumContent = <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red', fontSize: dynamicFontSize(24), fontFamily: "'Faculty Glyphic', serif", textAlign: 'center', padding: dynamicSize(50)}}>Erreur: {error}</div>;
  } else if (topArtefacts.length === 0 && !isLoading) { 
    podiumContent = <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', fontSize: dynamicFontSize(28), fontFamily: "'Faculty Glyphic', serif", textAlign: 'center', padding: dynamicSize(50)}}>Aucun artefact sur le podium pour le moment.</div>;
  } else {
    podiumContent = (
      <>
        {/* ARTEFACT 1ère PLACE */}
        {firstPlaceArtefactData && (
          <motion.div
            key={firstPlaceArtefactData.id + "-podium"}
            className="hover:scale-110 transition-transform transform-gpu cursor-pointer"
            style={{
              position: 'absolute',
              top: '-50%', 
              left: '38%',   
              transform: 'translateX(-50%)', 
              width: dynamicSize(firstPlaceSizePx.width),
              zIndex: 3,      
            }}
            onClick={() => handlePodiumArtefactClick(firstPlaceArtefactData.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {renderArtefact(firstPlaceArtefactData, dynamicSize(firstPlaceSizePx.width), dynamicSize(firstPlaceSizePx.height))}
          </motion.div>
        )}

        {/* ARTEFACT 2ème PLACE */}
        {secondPlaceArtefactData && (
          <motion.div
            key={secondPlaceArtefactData.id + "-podium"}
            className="hover:scale-110 transition-transform transform-gpu cursor-pointer"
            style={{
              position: 'absolute',
              top: '-13%',    
              left: '14%',   
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

        {/* ARTEFACT 3ème PLACE */}
        {thirdPlaceArtefactData && (
          <motion.div
            key={thirdPlaceArtefactData.id + "-podium"}
            className="hover:scale-110 transition-transform transform-gpu cursor-pointer"
            style={{
              position: 'absolute',
              top: '0%',     
              left: '68%',    
              width: dynamicSize(thirdPlaceSizePx.width),
              zIndex: 1,
            }}
            onClick={() => handlePodiumArtefactClick(thirdPlaceArtefactData.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {renderArtefact(thirdPlaceArtefactData, dynamicSize(thirdPlaceSizePx.width), dynamicSize(thirdPlaceSizePx.height))}
          </motion.div>
        )}
      </>
    );
  }


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
              {/* Le contenu du podium (artefacts ou messages) est rendu ici */}
              {podiumContent}
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
