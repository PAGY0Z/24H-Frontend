"use client";

import React, { useState, useEffect, CSSProperties, useRef, ReactNode } from "react"; // ReactNode ajouté
import { useRouter } from "next/navigation"; // useSearchParams n'est pas utilisé dans cette version statique
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// AJOUTÉ: Importation des composants d'artefacts
// Ajustez ces chemins si vos composants sont dans un autre dossier.
// Supposant que ArtefactShowClient.tsx est dans src/app/quelquechose/ et composants dans src/components/
// Si ArtefactShowClient.tsx est à la racine de app, alors ce serait ../components/...
// Pour l'exemple, je vais supposer une structure où ArtefactShowClient est un niveau plus profond que components.
// Si ArtefactShowClient.tsx est dans src/app/artefact_show/page.tsx par exemple:
import VideoArtefact from '@/app/components/Artefacts/VideoArtefact';
import PhotoArtefact from '@/app/components/Artefacts/PhotoArtefact';
import MusicArtefact from '@/app/components/Artefacts/MusicArtefact';

// AJOUTÉ: Types pour les données des artefacts (peut être dans un fichier partagé types.ts)
type ArtefactType = 'video' | 'photo' | 'audio';
type ArtefactTypeState = ArtefactType | null;

interface ArtefactData {
  id?: string | number;
  type?: ArtefactTypeState;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  photoUrl?: string;
  musicImageUrl?: string;
  initialVotes?: number;
  userHasVoted?: boolean;
}

// Résolution de design de référence
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080; // Ratio 16:9

// Fonction utilitaire pour la mise à l'échelle
const scaleToWidth = (originalPx: number, currentSceneWidth: number): number => {
  return (originalPx / DESIGN_WIDTH) * currentSceneWidth;
};

// Style de base initial de la scène
const initialSceneStyleBase: Omit<CSSProperties, 'width' | 'height' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight'> = {
  position: "relative",
  overflow: "hidden",
  backgroundImage: "url('/background_main.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const CONTENT_ROW_DESIGN_HEIGHT_PX = 800;
const ARTEFACT_PLACEHOLDER_DESIGN_HEIGHT = 0.90 * CONTENT_ROW_DESIGN_HEIGHT_PX;
const ARTEFACT_PLACEHOLDER_DESIGN_WIDTH = ARTEFACT_PLACEHOLDER_DESIGN_HEIGHT * (67 / 92);

const voteCounterFontSize = 22;
const voteCounterIconSize = 28;
const voteCounterMarginTop = 20;
const voteCounterImageMarginLeft = 8;
const conseilsButtonMinWidth = 280;

export default function ArtefactShowClient() {
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);
  const [sceneStyle, setSceneStyle] = useState<CSSProperties>({});
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);

  // MODIFIÉ: États pour les données de l'artefact et le système de vote
  const [artefactTitle, setArtefactTitle] = useState("Chargement du titre...");
  const [artefactDescription, setArtefactDescription] = useState("Chargement de la description...");
  const [currentArtefactType, setCurrentArtefactType] = useState<ArtefactTypeState>(null);
  const [currentArtefactData, setCurrentArtefactData] = useState<ArtefactData>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  const artefactZoneRef = useRef<HTMLDivElement>(null);

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
      const newPaddingValue = scaleToWidth(40, newWidth);
      const newStyles: CSSProperties = {
        ...initialSceneStyleBase,
        width: `${newWidth}px`,
        height: `${newHeight}px`,
        paddingTop: `${newPaddingValue}px`,
        paddingBottom: `${newPaddingValue}px`,
        paddingLeft: `${newPaddingValue}px`,
        paddingRight: `${newPaddingValue}px`,
      };
      setSceneStyle(newStyles);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // MODIFIÉ: Charger un artefact photo par défaut
    const loadDefaultArtefact = () => {
      const defaultPhotoData: ArtefactData = {
        id: 'default_photo_01', // Un ID statique pour l'exemple
        type: 'photo',
        title: 'Photographie d\'Exemple',
        description: `Ceci est une description pour la photographie affichée par défaut. Vous pourrez rendre ces informations dynamiques plus tard en les reliant à votre backend. N'oubliez pas de placer une image '/placeholder_photo.jpg' dans votre dossier /public pour que cela fonctionne. ${"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.".substring(0,150)}`,
        photoUrl: '/placeholder_photo.jpg', // Assurez-vous que cette image existe
        initialVotes: 77, // Exemple de votes initiaux
        userHasVoted: false, // Exemple
      };

      setArtefactTitle(defaultPhotoData.title || "Titre par Défaut");
      setArtefactDescription(defaultPhotoData.description || "Description par Défaut");
      setCurrentArtefactType(defaultPhotoData.type || null);
      setCurrentArtefactData(defaultPhotoData);
      setTotalVotes(defaultPhotoData.initialVotes || 0);
      setHasVoted(defaultPhotoData.userHasVoted || false);
    };

    loadDefaultArtefact();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Le tableau de dépendances vide exécute cela une fois au montage

  const dynamicFontSize = (originalPxSize: number): string => {
    return `${scaleToWidth(originalPxSize, currentSceneWidth)}px`;
  };

  const dynamicSize = (originalPxSize: number): string => {
    return `${scaleToWidth(originalPxSize, currentSceneWidth)}px`;
  };

  const handleReturn = () => {
    setIsLeaving(true);
    setTimeout(() => {
      router.back();
    }, 600);
  };

  const handleSupportMemory = () => {
    if (!hasVoted) {
      console.log("Support this memory clicked! Artefact ID:", currentArtefactData.id);
      setHasVoted(true);
      setTotalVotes(prevTotalVotes => prevTotalVotes + 1);
      // TODO: Appel API pour enregistrer le vote pour currentArtefactData.id
    }
  };

  const infoBoxPadding = 20;
  const titleFontSize = 30;
  const descriptionFontSize = 20;
  const buttonPaddingX = 24;
  const buttonPaddingY = 8;
  const buttonFontSize = 25;
  const likeIconSize = 30;

  // AJOUTÉ: Fonction pour rendre l'artefact principal
  const renderMainArtefact = (): ReactNode => {
    const artefactDisplayWidth = dynamicSize(ARTEFACT_PLACEHOLDER_DESIGN_WIDTH);
    const artefactDisplayHeight = dynamicSize(ARTEFACT_PLACEHOLDER_DESIGN_HEIGHT);

    const handleArtefactDisplayClick = () => {
      console.log(`Artefact ${currentArtefactType} cliqué:`, currentArtefactData);
      // Ajoutez ici la logique pour lire une vidéo, agrandir une photo, etc.
    };

    if (!currentArtefactType) {
      return (
        <div style={{
            width: artefactDisplayWidth, height: artefactDisplayHeight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: dynamicSize(8),
            border: `${dynamicSize(1)} dashed rgba(255,255,255,0.4)`, fontFamily: "'Faculty Glyphic', serif",
            textAlign: 'center', padding: dynamicSize(10)
        }}>
          Chargement de l&apos;artefact...
        </div>
      );
    }

    switch (currentArtefactType) {
      case 'video':
        return (
          <VideoArtefact
            thumbnailUrl={currentArtefactData.thumbnailUrl}
            width={artefactDisplayWidth}
            height={artefactDisplayHeight}
            altText={artefactTitle} // Utilise l'état artefactTitle
            onClick={handleArtefactDisplayClick}
          />
        );
      case 'photo':
        return (
          <PhotoArtefact
            photoUrl={currentArtefactData.photoUrl}
            width={artefactDisplayWidth}
            height={artefactDisplayHeight}
            altText={artefactTitle} // Utilise l'état artefactTitle
            onClick={handleArtefactDisplayClick}
          />
        );
      case 'audio':
        return (
          <MusicArtefact
            musicImageUrl={currentArtefactData.musicImageUrl}
            width={artefactDisplayWidth}
            height={artefactDisplayHeight}
            altText={artefactTitle} // Utilise l'état artefactTitle
            onClick={handleArtefactDisplayClick}
          />
        );
      default:
        // Normalement intercepté par !currentArtefactType, mais bon pour l'exhaustivité
        const _exhaustiveCheck: never = currentArtefactType;
        console.warn("Type d'artefact inconnu:", _exhaustiveCheck)
        return <div style={{color: 'red'}}>Erreur: Type d&apos;artefact non supporté.</div>;
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black padding-20"> {/* padding-20 est une classe personnalisée? */}
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
          key="artefact-show-page-content"
          style={sceneStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white flex flex-col"
        >
          <div
            className="flex flex-row items-stretch w-full"
            style={{
              gap: dynamicSize(0),
              minHeight: 0,
              height: dynamicSize(CONTENT_ROW_DESIGN_HEIGHT_PX),
            }}
          >
            {/* Bloc Gauche (Affichage de l'artefact) - MODIFIÉ */}
            <div
              ref={artefactZoneRef}
              className="flex items-center justify-center bg-transparent rounded-xl" 
              // J'ai enlevé shadow-lg et overflow-hidden ici, car les composants d'artefact pourraient avoir leurs propres styles de bordure/ombre.
              // Si vous voulez un cadre/ombre commun autour de la zone, vous pouvez les remettre.
              style={{
                width: dynamicSize(ARTEFACT_PLACEHOLDER_DESIGN_WIDTH + 20), // Ce conteneur peut être légèrement plus grand
              }}
            >
              {/* APPEL DE LA FONCTION DE RENDU DE L'ARTEFACT */}
              {renderMainArtefact()}
            </div>

            {/* Bloc Droit (Informations) */}
            <div
              className="rounded-xl shadow-lg flex flex-col mt-15" // mt-15 classe personnalisée?
              style={{
                flex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                padding: dynamicSize(infoBoxPadding),
                overflow: 'hidden',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                height: '80%',
              }}
            >
              <h2
                className="font-bold text-black mb-2"
                style={{
                  fontFamily: "'Faculty Glyphic', serif",
                  fontSize: dynamicFontSize(titleFontSize),
                  lineHeight: dynamicSize(titleFontSize * 1.2),
                  flexShrink: 0,
                }}
              >
                {artefactTitle} {/* MODIFIÉ pour utiliser l'état */}
              </h2>
              <div className="overflow-y-auto flex-grow" style={{ minHeight: 0 }}>
                <p
                  className="text-gray-700"
                  style={{
                    fontFamily: "'Faculty Glyphic', serif",
                    fontSize: dynamicFontSize(descriptionFontSize),
                    lineHeight: dynamicSize(descriptionFontSize * 1.4),
                    whiteSpace: 'pre-line',
                  }}
                >
                  {artefactDescription} {/* MODIFIÉ pour utiliser l'état */}
                </p>
              </div>

              {/* Compteur de votes */}
              <div
                className="flex items-center self-start"
                style={{
                  fontFamily: "'Faculty Glyphic', serif",
                  marginTop: dynamicSize(voteCounterMarginTop),
                }}
              >
                <span
                  className="font-bold text-black"
                  style={{
                    fontSize: dynamicFontSize(voteCounterFontSize),
                  }}
                >
                  {totalVotes}
                </span>
                <div style={{ marginLeft: dynamicSize(voteCounterImageMarginLeft) }}>
                  <Image
                    src="/like_vote.png"
                    alt="Votes icon"
                    width={voteCounterIconSize}
                    height={voteCounterIconSize}
                    style={{
                      width: dynamicSize(voteCounterIconSize),
                      height: dynamicSize(voteCounterIconSize),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Conteneur pour les boutons du bas */}
          <div
            className="flex justify-center items-center pt-4 mb-10"
            style={{ gap: dynamicSize(30), marginTop: dynamicSize(0) }}
          >
            <button
              onClick={handleReturn}
              className="bg-[#8B4513] hover:bg-[#5C3210] font-bold text-white rounded-full transition flex items-center justify-center"
              style={{
                fontFamily: "'Faculty Glyphic', serif",
                fontSize: dynamicFontSize(buttonFontSize),
                padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                minWidth: dynamicSize(200),
              }}
            >
              BACK
            </button>
            <a
              href="https://chatgpt.com/g/g-68288192e87c8191b7aea6ae5e8a8cdc-the-end-page-museum"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 font-bold text-white rounded-full transition flex items-center justify-center"
              style={{
                fontFamily: "'Faculty Glyphic', serif",
                fontSize: dynamicFontSize(buttonFontSize),
                padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                minWidth: dynamicSize(conseilsButtonMinWidth),
                textDecoration: 'none',
              }}
            >
              GET ADVICE
            </a>
            {hasVoted ? (
              <div
                className="flex items-center justify-center font-bold rounded-full"
                style={{
                  fontFamily: "'Faculty Glyphic', serif",
                  fontSize: dynamicFontSize(buttonFontSize),
                  padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                  minWidth: dynamicSize(300),
                  color: "darkred",
                }}
              >
                <div style={{ marginRight: dynamicSize(10) }}>
                  <Image
                    src="/like_vote.png"
                    alt="Vote Added"
                    width={likeIconSize}
                    height={likeIconSize}
                    style={{
                      width: dynamicSize(likeIconSize),
                      height: dynamicSize(likeIconSize),
                    }}
                  />
                </div>
                VOTE ADDED
              </div>
            ) : (
              <button
                onClick={handleSupportMemory}
                className="bg-red-300 hover:bg-red-400 font-bold text-black rounded-full transition flex items-center justify-center"
                style={{
                  fontFamily: "'Faculty Glyphic', serif",
                  fontSize: dynamicFontSize(buttonFontSize),
                  padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                  minWidth: dynamicSize(300),
                }}
              >
                <div style={{ marginRight: dynamicSize(10) }}>
                  <Image
                    src="/like_vote.png"
                    alt="Like"
                    width={likeIconSize}
                    height={likeIconSize}
                    style={{
                      width: dynamicSize(likeIconSize),
                      height: dynamicSize(likeIconSize),
                    }}
                  />
                </div>
                SUPPORT THIS MEMORY
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}