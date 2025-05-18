"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image"; // Importation de Next Image

// Définissez votre résolution de design de référence ici.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080; // 16:9 ratio

// Fonctions utilitaires
const scaleToWidth = (originalPx: number, currentSceneWidth: number): number => {
  return (originalPx / DESIGN_WIDTH) * currentSceneWidth;
};

// État initial du style de la scène
const initialSceneStyle: CSSProperties = {
  // width et height seront définis dynamiquement par useEffect
  position: "relative",
  overflow: "hidden",
  backgroundImage: "url('/background_positif.png')", // Assurez-vous que ce chemin est correct
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  // justifyContent sera défini dans le style de motion.div pour pousser le contenu vers le bas
  alignItems: "center", // Pour centrer les enfants horizontalement
};

export default function ArtefactsClient() {
  const router = useRouter();

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

      const newStyles: CSSProperties = {
        ...initialSceneStyle, // Conserve backgroundImage, backgroundSize, etc.
        width: `${newWidth}px`,
        height: `${newHeight}px`,
        // justifyContent est géré dynamiquement ci-dessous ou dans le motion.div
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
      router.push("/");
    }, 600);
  };

  // Valeurs de design originales pour les éléments restants et nouveaux
  const buttonPaddingX = 25;
  const buttonPaddingY = 8;
  const buttonFontSize = 25;
  const buttonMarginBottom = 70; // Marge en bas pour le bouton retour

  const podiumImageOriginalWidth = 1000; // Largeur originale de l'image podium pour le design
  // IMPORTANT: Ajustez podiumImageOriginalHeight pour correspondre au ratio de votre image podium.png
  // Par exemple, si votre image fait 700x467, mettez 467.
  const podiumImageOriginalHeight = 467; // Hauteur intrinsèque pour next/image
  const podiumButtonGap = -43; // Espace entre le podium et le bouton retour

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

          {/* Scène principale avec contenu et animations */}
          <motion.div
            key="artefacts-page-content"
            style={{
              ...sceneStyle, // Applique width, height, background, etc.
              justifyContent: 'flex-end', // Pousse le contenu (podium, bouton) vers le bas
            }}
            className="flex flex-col items-center" // S'assure que les enfants sont centrés horizontalement
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Image Podium */}
            <div style={{ marginBottom: dynamicSize(podiumButtonGap) }}>
              <Image
                src="/podium.png" // Assurez-vous que ce chemin est correct (dans /public)
                alt="Podium"
                width={podiumImageOriginalWidth} // Largeur intrinsèque pour next/image
                height={podiumImageOriginalHeight} // Hauteur intrinsèque pour next/image (maintenir le ratio)
                style={{
                  width: dynamicSize(podiumImageOriginalWidth), // Largeur responsive
                  height: 'auto', // Maintient le ratio d'aspect
                }}
                priority // Peut être utile si c'est l'élément principal visible au chargement
              />
            </div>

            {/* Section Bouton Retour */}
            <div
              className="text-center mr-230" // Le parent motion.div s'occupe du centrage horizontal global
              style={{
                marginBottom: dynamicSize(buttonMarginBottom),
                width: '100%', // Assure que le conteneur du bouton prend la largeur pour text-align
              }}
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
