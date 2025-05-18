"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Définissez votre résolution de design de référence ici.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080; // 16:9 ratio

// Fonctions utilitaires
const scaleToWidth = (originalPx: number, currentSceneWidth: number): number => {
  return (originalPx / DESIGN_WIDTH) * currentSceneWidth;
};

// État initial du style de la scène
const initialSceneStyle: CSSProperties = {
  width: `${DESIGN_WIDTH}px`,
  height: `${DESIGN_HEIGHT}px`,
  position: "relative", 
  overflow: "hidden",   
  backgroundImage: "url('/background_main.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex", 
  flexDirection: "column", 
  justifyContent: "space-between",
  padding: `${(40 / DESIGN_WIDTH) * DESIGN_WIDTH}px`,
};


export default function ArtefactShowClient() {
  const router = useRouter();
  // const artefactId = searchParams.get("id"); 

  const [isLeaving, setIsLeaving] = useState(false);

  const [sceneStyle, setSceneStyle] = useState<CSSProperties>(initialSceneStyle);
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);
  

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
        width: `${newWidth}px`,
        height: `${newHeight}px`,
        position: "relative", 
        overflow: "hidden",   
        backgroundImage: "url('/background_main.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between",
        paddingTop: `${newPaddingValue}px`,
        paddingBottom: `${newPaddingValue}px`,
        paddingLeft: `${newPaddingValue}px`,
        paddingRight: `${newPaddingValue}px`,
      };
      setSceneStyle(newStyles);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
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
      router.back();
    }, 600);
  };

  // Valeurs de design originales pour la nouvelle mise en page
  const infoBoxPadding = 25;
  const titleFontSize = 50; 
  const descriptionFontSize = 40; 
  const buttonPaddingX = 24;
  const buttonPaddingY = 8;
  const buttonFontSize = 25;

  const loremTitle = "Lorem Ipsum Dolor Sit Amet";
  const loremDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
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
            key="artefact-show-page-content"
            style={sceneStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white" 
          >
            <div 
              className="flex flex-row flex-grow" 
              style={{ gap: dynamicSize(30) }} 
            >
              {/* Bloc Gauche (Affichage de l'artefact) */}
              <div 
                className="flex-grow-[3] bg-gray-700/30 rounded-xl shadow-lg flex items-center justify-center"
              >
                <span style={{ fontSize: dynamicFontSize(30), color: 'rgba(255,255,255,0.7)' }}>
                  Zone Artefact (ex: Image)
                </span>
              </div>

              {/* Bloc Droit (Informations) */}
              <div
                className="flex-grow-[1] rounded-xl shadow-lg flex flex-col" 
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)", 
                  padding: dynamicSize(infoBoxPadding),
                  overflowY: 'auto', 
                  maxHeight: `calc(100% - ${dynamicSize(0)})`,
                  // Ajout du backdrop-filter pour l'effet de flou
                  backdropFilter: 'blur(8px)', // Vous pouvez ajuster la valeur du flou (ex: 'blur(4px)', 'blur(12px)')
                  WebkitBackdropFilter: 'blur(8px)', // Pour la compatibilité avec Safari plus ancien
                }}
              >
                <h2
                  className="font-bold text-black mb-4" 
                  style={{
                    fontFamily: "'Faculty Glyphic', serif", 
                    fontSize: dynamicFontSize(titleFontSize), 
                    lineHeight: dynamicSize(titleFontSize * 1.2), 
                  }}
                >
                  {loremTitle}
                </h2>
                <p
                  className="text-gray-700" 
                  style={{
                    fontFamily: "'Faculty Glyphic', serif", 
                    fontSize: dynamicFontSize(descriptionFontSize), 
                    lineHeight: dynamicSize(descriptionFontSize * 1.5), 
                    whiteSpace: 'pre-line', 
                  }}
                >
                  {loremDescription}
                </p>
              </div>
            </div>
            
            <div 
              className="text-center mt-auto pt-4" 
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
                BACK
              </button>
            </div>
          </motion.div>
        </>
      </AnimatePresence>
    </div>
  );
}
