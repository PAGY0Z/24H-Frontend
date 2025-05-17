"use client";
import React, { useState, useEffect, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// Définissez votre résolution de design ici.
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

// Fonction utilitaire pour convertir les pixels de design en pourcentage
const pxToPercentWidth = (px: number): number => (px / DESIGN_WIDTH) * 100;
const pxToPercentHeight = (px: number): number => (px / DESIGN_HEIGHT) * 100;

// Définir l'état initial avec le type pour plus de clarté
const initialSceneStyle: CSSProperties = {
  width: `${DESIGN_WIDTH}px`,
  height: `${DESIGN_HEIGHT}px`,
  position: "relative",
  overflow: "hidden",
  backgroundImage: "url('/background_main.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isRightHovered, setIsRightHovered] = useState(false);
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const [sceneStyle, setSceneStyle] = useState<CSSProperties>(initialSceneStyle);

  const router = useRouter();

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
      
      const newStyles: CSSProperties = {
        width: `${newWidth}px`,
        height: `${newHeight}px`,
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/background_main.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
      setSceneStyle(newStyles);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let currentSceneWidthNum = DESIGN_WIDTH;
  if (typeof sceneStyle.width === 'string') {
    currentSceneWidthNum = parseFloat(sceneStyle.width);
  } else if (typeof sceneStyle.width === 'number') {
    currentSceneWidthNum = sceneStyle.width;
  }
  if (isNaN(currentSceneWidthNum)) {
    currentSceneWidthNum = DESIGN_WIDTH;
  }

  const dynamicFontSize = (originalPxSize: number): string => {
    return `${(originalPxSize / DESIGN_WIDTH) * currentSceneWidthNum}px`;
  };

  const dynamicSize = (originalPxSize: number): string => {
    return `${(originalPxSize / DESIGN_WIDTH) * currentSceneWidthNum}px`;
  };

  const validateEmail = (emailToValidate: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate);
  };

  const handleSubmit = () => {
    if (!validateEmail(email.trim())) {
      setError("Le format de l'email n'est pas valide.");
    } else {
      setError("");
      setShowModal(false);
      setIsLeaving(true);
      setTimeout(() => {
        router.push(`/artefacts?email=${encodeURIComponent(email.trim())}`);
      }, 600);
    }
  };

  const panelImageRatioWidth = 320;
  const panelImageRatioHeight = 480; 

  const doorImageRatioWidth = 150;
  const doorImageRatioHeight = 225; 

  const modalBaseWidth = 700; 
  const modalBasePadding = 32; 
  const modalButtonBasePaddingY = 12; 
  const modalButtonBasePaddingX = 36; 
  const modalBlurAmount = '10px'; // Quantité de flou pour le fond du modal

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
            key="page-content"
            style={sceneStyle}
            className="text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence>
              {showModal && (
                <>
                  {/* Le fond noir semi-transparent qui couvre toute la scène derrière le modal */}
                  {/* Ce div n'a pas besoin de backdrop-filter, il est juste là pour assombrir */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }} // Opacité du fond noir (peut être ajustée)
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black z-40" // Pas de backdrop-blur ici
                  />
                  {/* Le modal lui-même */}
                  <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center z-50"
                  >
                    {/* Contenu du Modal avec fond blanc semi-transparent et flou */}
                    <div
                      className="relative rounded-xl shadow-lg text-center" // bg-white retiré
                      style={{
                        width: `${pxToPercentWidth(modalBaseWidth)}%`,
                        padding: dynamicSize(modalBasePadding),
                        backgroundColor: "rgba(255, 255, 255, 0.5)", // Fond blanc avec opacité
                        backdropFilter: `blur(${modalBlurAmount})`,      // Flou de l'arrière-plan
                        WebkitBackdropFilter: `blur(${modalBlurAmount})`, // Pour Safari
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setError("");
                          setEmail("");
                        }}
                        className="absolute bg-[#8B4513] hover:bg-[#5C3210] text-white font-bold rounded-full transition"
                        style={{
                          top: `${pxToPercentHeight(25)}%`,
                          right: `${pxToPercentWidth(25)}%`,
                          fontSize: dynamicFontSize(30),
                          width: dynamicSize(40),
                          height: dynamicSize(40),
                          lineHeight: dynamicSize(38), // Ajusté pour mieux centrer la croix
                        }}
                        aria-label="Fermer"
                      >
                        ×
                      </button>

                      <h2
                        className="font-bold text-black" // Texte en noir pour contraster avec le fond clair
                        style={{
                          fontFamily: "'Faculty Glyphic', serif",
                          fontSize: dynamicFontSize(28),
                          marginTop: `${pxToPercentHeight(20)}%`,
                          marginBottom: `${pxToPercentHeight(0)}%`,
                        }}
                      >
                        RECHERCHER / AJOUTER UTILISATEUR
                      </h2>
                      <h3
                        className="text-black" // Texte en noir
                        style={{
                          fontFamily: "'Faculty Glyphic', serif",
                          fontSize: dynamicFontSize(25),
                          marginTop: `${pxToPercentHeight(12)}%`,
                          marginBottom: `${pxToPercentHeight(60)}%`,
                        }}
                      >
                        Entrez votre email ou celui d&#39;un ami
                      </h3>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@email.com"
                        className="w-full border rounded text-black bg-white/70 placeholder-gray-500" // Fond de l'input légèrement transparent
                        style={{
                          fontFamily: "'Faculty Glyphic', serif",
                          fontSize: dynamicFontSize(25),
                          padding: dynamicSize(10),
                          marginBottom: `${pxToPercentHeight(30)}%`,
                        }}
                      />

                      {error && (
                        <p
                          className="text-red-700 font-semibold" // Couleur d'erreur plus foncée pour lisibilité
                          style={{
                            fontFamily: "'Faculty Glyphic', serif",
                            fontSize: dynamicFontSize(20),
                            marginTop: `${pxToPercentHeight(8)}%`,
                            marginBottom: `${pxToPercentHeight(8)}%`,
                          }}
                        >
                          {error}
                        </p>
                      )}

                      <button
                        onClick={handleSubmit}
                        className="bg-[#8B4513] hover:bg-[#5C3210] rounded-full font-bold text-white transition"
                        style={{
                          fontFamily: "'Faculty Glyphic', serif",
                          fontSize: dynamicFontSize(20),
                          paddingTop: dynamicSize(modalButtonBasePaddingY),
                          paddingBottom: dynamicSize(modalButtonBasePaddingY),
                          paddingLeft: dynamicSize(modalButtonBasePaddingX),
                          paddingRight: dynamicSize(modalButtonBasePaddingX),
                          marginTop: `${pxToPercentHeight(45)}%`,
                        }}
                      >
                        OUVRIR LA PORTE
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Reste de la page (Titre, Panneaux, Porte) */}
            <div
              className="absolute text-center"
              style={{
                top: `${pxToPercentHeight(DESIGN_HEIGHT * 0.17)}%`,
                left: "50%",
                transform: "translateX(-50%)",
                width: `${pxToPercentWidth(1000)}%`,
              }}
            >
              <h1
                className="font-bold drop-shadow-lg text-black"
                style={{
                  fontFamily: "Limelight, cursive",
                  fontSize: dynamicFontSize(80),
                }}
              >
                The End Page Museum
              </h1>
              <p
                className="drop-shadow-md text-black"
                style={{
                  fontFamily: "'Faculty Glyphic', serif",
                  fontSize: dynamicFontSize(30),
                  marginTop: `${pxToPercentHeight(10)}%`,
                }}
              >
                AN ADVENTURE DOWN MEMORY LANE
              </p>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: `${pxToPercentHeight(80)}%`,
                left: `${pxToPercentWidth(DESIGN_WIDTH * 0.13)}%`,
                width: `${pxToPercentWidth(380)}%`,
              }}
              className="bg-transparent border-none outline-none cursor-pointer"
              onMouseEnter={() => setIsLeftHovered(true)}
              onMouseLeave={() => setIsLeftHovered(false)}
              role="button"
              tabIndex={0}
              onClick={() => { /* Action pour panneau gauche si nécessaire */ }}
            >
              <Image
                src={isLeftHovered ? "/panneau_negatif_hover.png" : "/panneau_negatif.png"}
                alt="Panneau gauche"
                layout="responsive"
                width={panelImageRatioWidth}
                height={panelImageRatioHeight}
                className="transition"
              />
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: `${pxToPercentHeight(199)}%`, 
                left: "50%",
                transform: "translateX(-50%)",
                width: `${pxToPercentWidth(420)}%`,
              }}
              className="bg-transparent border-none outline-none cursor-pointer"
              onClick={() => setShowModal(true)}
              role="button"
              tabIndex={0}
            >
              <Image
                src="/porte.png"
                alt="Porte centrale"
                layout="responsive"
                width={doorImageRatioWidth}
                height={doorImageRatioHeight}
                className="transition"
              />
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: `${pxToPercentHeight(80)}%`,
                right: `${pxToPercentWidth(DESIGN_WIDTH * 0.13)}%`,
                width: `${pxToPercentWidth(380)}%`,
              }}
              className="bg-transparent border-none outline-none cursor-pointer"
              onMouseEnter={() => setIsRightHovered(true)}
              onMouseLeave={() => setIsRightHovered(false)}
              role="button"
              tabIndex={0}
              onClick={() => { /* Action pour panneau droit si nécessaire */ }}
            >
              <Image
                src={isRightHovered ? "/panneau_positif_hover.png" : "/panneau_positif.png"}
                alt="Panneau droite"
                layout="responsive"
                width={panelImageRatioWidth}
                height={panelImageRatioHeight}
                className="transition"
              />
            </div>
          </motion.div>
        </>
      </AnimatePresence>
    </div>
  );
}
