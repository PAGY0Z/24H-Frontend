"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// Définissez votre résolution de design de référence ici.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080; // 16:9 ratio

// Fonctions utilitaires
// Pas de changement ici
const pxToPercentWidth = (px: number): number => (px / DESIGN_WIDTH) * 100;
const pxToPercentHeight = (px: number): number => (px / DESIGN_HEIGHT) * 100;
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
  justifyContent: "space-between", // Pour espacer titre, grille, et bouton retour
};

export default function ArtefactsClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "Inconnu";
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);
  const items = Array.from({ length: 4 }, (_, i) => i + 1);

  const [sceneStyle, setSceneStyle] = useState<CSSProperties>(initialSceneStyle);
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);
  const [isRightHovered, setIsRightHovered] = useState(false);

  

  useEffect(() => {
    const handleResize = () => {
      const aspectRatio = DESIGN_WIDTH / DESIGN_HEIGHT;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight;
      const windowRatio = newWidth / newHeight;

      if (windowRatio > aspectRatio) {
        // La fenêtre est plus large que le design, la hauteur est limitante
        newHeight = window.innerHeight;
        newWidth = newHeight * aspectRatio;
      } else {
        // La fenêtre est plus haute (ou égale) que le design, la largeur est limitante
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

    handleResize(); // Appel initial pour définir la taille
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Dépendance vide pour exécuter à l' montaje et nettoyage au démontage

  // Fonction pour calculer la taille de police dynamique
  const dynamicFontSize = (originalPxSize: number): string => {
    return `${scaleToWidth(originalPxSize, currentSceneWidth)}px`;
  };

  // Fonction pour calculer les dimensions dynamiques
  const dynamicSize = (originalPxSize: number): string => {
    return `${scaleToWidth(originalPxSize, currentSceneWidth)}px`;
  };

  // Gestion du clic sur le bouton Retour
  const handleReturn = () => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push("/");
    }, 600); // Durée de l'animation de sortie
  };

  // Gestion du clic sur un artefact
  const handleItemClick = (itemId: number) => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push(`/artefact_show?id=${itemId}`);
    }, 600); // Durée de l'animation de sortie
  };

  // Action pour le nouveau bouton "+" global
  const handleGlobalAddClick = () => {
    console.log("Bouton + Global cliqué");
    // Implémentez votre logique ici, par ex:
    // router.push('/nouveau-artefact');
    // Pour l'exemple, nous allons simuler une navigation après une animation
    setIsLeaving(true);
    setTimeout(() => {
      router.push('/artefact_add'); // Décommentez et ajustez la route
      //console.log("Navigation vers la page de création d'artefact (simulée)");
      //setIsLeaving(false); // Réinitialiser si ce n'est pas une navigation réelle
    }, 600);
  };

  // Valeurs de design originales pour les éléments de la scène
  const titleMarginTop = 185;
  // const emailMarginTop = -10; // Conservé au cas où, mais non utilisé dans le code actuel
  const gridGap = 80;
  const itemOriginalWidthPx = 280;
  const itemOriginalHeightPx = (itemOriginalWidthPx / 67) * 92; // Maintien du ratio de l'item

  const buttonPaddingX = 24;
  const buttonPaddingY = 8;
  const buttonMarginBottom = 90;

  // Dimensions pour le nouveau bouton "+" (valeurs de design originales)
  const globalPlusButtonSize = 150; // Diamètre du bouton
  const globalPlusIconSize = 120;   // Taille du symbole "+"

  return (
    // Conteneur principal qui remplit la fenêtre, fond noir.
    // Il sert de contexte de positionnement pour le bouton "+" absolu
    // et de conteneur flex pour centrer la scène.
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      {/* Conteneur pour la scène principale et son animation */}
      {/* Ce div interne assure que la scène est bien centrée par le parent flex */}
      <div className="relative"> {/* Ajouté pour que z-index de l'overlay fonctionne correctement par rapport au bouton + */}
        <AnimatePresence mode="wait">
          <>
            {isLeaving && (
              <motion.div
                className="fixed inset-0 bg-black z-[999]" // z-index élevé pour couvrir toute la page
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}

            {/* Scène principale avec contenu et animations */}
            <motion.div
              key="artefacts-page-content"
              style={sceneStyle} // Applique le style dynamique (width, height, background, etc.)
              className="flex flex-col justify-between" // Assure la disposition interne (titre en haut, grille au milieu, bouton en bas)
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Section Titre */}
              <div
                className="flex flex-row items-baseline justify-center text-center mr-50"
                style={{
                  marginTop: dynamicSize(titleMarginTop),
                }}
              >
                <div
                  className="text-black font-bold" // Couleur de texte à ajuster si le fond est sombre
                  style={{
                    fontFamily: "Limelight, cursive",
                    fontSize: dynamicFontSize(50),
                    marginRight: dynamicSize(20),
                  }}
                >
                  ARTIFACTS :
                </div>
                <div
                  className="text-black font-bold" // Couleur de texte à ajuster
                  style={{
                    fontFamily: "'Faculty Glyphic', serif",
                    fontSize: dynamicFontSize(55),
                  }}
                >
                  {email}
                </div>
              </div>

              {/* Section Grille d'artefacts */}
              <div className="flex justify-center mr-50 mb-33" > {/* Centre la grille horizontalement */}
                <div
                  className="grid grid-cols-4" // Maintenir 4 colonnes
                  style={{
                    gap: dynamicSize(gridGap), // Espace dynamique entre les items
                  }}
                >
                  {items.map((item) => (
                    <div
                      key={item}
                      className="bg-white/50 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
                      style={{
                        width: dynamicSize(itemOriginalWidthPx),
                        height: dynamicSize(itemOriginalHeightPx),
                      }}
                      onClick={() => handleItemClick(item)}
                      role="button"
                      tabIndex={0} // Pour l'accessibilité au clavier
                      onKeyDown={(e) => { // Gestion de l'activation par Entrée/Espace
                        if (e.key === "Enter" || e.key === " ") {
                          handleItemClick(item);
                        }
                      }}
                    >
                      {/* Contenu de l'item (peut être une image, du texte, etc.) */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Bouton Retour */}
              <div
                className="text-center"
                style={{
                  marginBottom: dynamicSize(buttonMarginBottom),
                }}
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


      {/* NOUVEAU: Bouton "+" Global - Positionné par rapport à la fenêtre */}
      <button
        onClick={handleGlobalAddClick}
        aria-label="Ajouter un artefact"
        className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 z-50
                   bg-white text-black rounded-full shadow-xl hover:bg-gray-200 mr-20
                   focus:outline-none focus:ring-2 focus:ring-gray-300
                   flex items-center justify-center transition-transform hover:scale-110"
        style={{
          width: dynamicSize(globalPlusButtonSize),   // Taille dynamique
          height: dynamicSize(globalPlusButtonSize),  // Taille dynamique
          fontSize: dynamicFontSize(globalPlusIconSize), // Taille de l'icône dynamique
          lineHeight: '1', // Aide au centrage vertical du '+'
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
              onClick={() => { /* Action pour panneau droit si nécessaire */ }}
            >
              <Image
                src={isRightHovered ? "/panneau_suivant_hover.png" : "/panneau_suivant.png"}
                alt="Panneau droite"
                layout="responsive"
                width={0}
                height={0}
                className="transition"
              />
            </div>

    </div>
  );
}
