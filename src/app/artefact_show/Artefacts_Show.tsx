"use client";

import React, { useState, useEffect, CSSProperties, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

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

// AJOUTÉ: Constante pour la largeur minimale du nouveau bouton (optionnel, pour cohérence)
const conseilsButtonMinWidth = 280; // Ajustez au besoin

export default function ArtefactShowClient() {
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);
  const [sceneStyle, setSceneStyle] = useState<CSSProperties>({});
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);
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

    const fetchInitialData = () => {
      setTotalVotes(1387);
    };
    fetchInitialData();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
      router.back();
    }, 600);
  };

  const handleSupportMemory = () => {
    if (!hasVoted) {
      console.log("Support this memory clicked!");
      setHasVoted(true);
      setTotalVotes(prevTotalVotes => prevTotalVotes + 1);
      // ... (API call logic)
    }
  };

  const infoBoxPadding = 20;
  const titleFontSize = 30;
  const descriptionFontSize = 20;
  const buttonPaddingX = 24;
  const buttonPaddingY = 8;
  const buttonFontSize = 25;
  const likeIconSize = 30;

  const loremTitle = "Artefact Title";
  const loremDescription = `This is a detailed description of the artefact, highlighting its unique features and historical significance. The artefact is well-preserved and offers insights into the past. Further research is ongoing to uncover more about its origins and the stories it holds. We encourage visitors to appreciate its craftsmanship and the context from which it came. This text is elongated to test scrolling functionality within the reduced height. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black padding-20">
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
            <div
              ref={artefactZoneRef}
              className="flex items-center justify-center bg-transparent rounded-xl shadow-lg overflow-hidden"
              style={{
                width: dynamicSize(ARTEFACT_PLACEHOLDER_DESIGN_WIDTH + 20),
              }}
            >
              <div
                style={{
                  height: '80%',
                  aspectRatio: '67 / 92',
                  maxWidth: '100%',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: dynamicSize(8),
                  border: `${dynamicSize(1)} dashed rgba(255,255,255,0.4)`,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: dynamicFontSize(16),
                  textAlign: 'center',
                  padding: dynamicSize(10),
                  boxSizing: 'border-box',
                  fontFamily: "'Faculty Glyphic', serif",
                }}
              >
                Zone Artefact<br />(Ratio 67:92)
              </div>
            </div>

            <div
              className="rounded-xl shadow-lg flex flex-col mt-15"
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
                {loremTitle}
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
                  {loremDescription}
                </p>
              </div>

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
            className="flex justify-center items-center pt-4 mb-10" // Tailwind: pt-4 et mb-10 sont des classes valides si configurées
            style={{ gap: dynamicSize(30), marginTop: dynamicSize(0) }} // `gap` est géré par flexbox, marginTop est ok
          >
            {/* BOUTON BACK */}
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

            {/* AJOUTÉ: Bouton "Obtenir des conseils" */}
            <a
              href="https://chatgpt.com/g/g-68288192e87c8191b7aea6ae5e8a8cdc-the-end-page-museum"
              target="_blank"
              rel="noopener noreferrer" // Pour la sécurité et la performance
              className="bg-green-600 hover:bg-green-700 font-bold text-white rounded-full transition flex items-center justify-center" // Classes Tailwind pour le style
              style={{
                fontFamily: "'Faculty Glyphic', serif",
                fontSize: dynamicFontSize(buttonFontSize),
                padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                minWidth: dynamicSize(conseilsButtonMinWidth), // Utilisation de la nouvelle constante
                textDecoration: 'none', // Pour enlever le soulignement par défaut des liens
              }}
            >
              GET ADVICE
            </a>
            {/* FIN DE L'AJOUT du bouton "Obtenir des conseils" */}

            {/* Bouton "Support this memory" / Message "VOTE ADDED" */}
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