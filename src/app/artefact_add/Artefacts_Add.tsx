"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import { useRouter } // No useSearchParams needed for this form page directly
from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Design reference resolution (16:9 ratio)
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

// Utility functions for responsive scaling
const scaleToWidth = (originalPx: number, currentSceneWidth: number): number => {
  return (originalPx / DESIGN_WIDTH) * currentSceneWidth;
};

// Initial scene style (background, layout)
// Padding will be applied dynamically
const initialSceneStyleBase: Omit<CSSProperties, 'width' | 'height' | 'padding' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight'> = {
  position: "relative",
  overflow: "hidden",
  backgroundImage: "url('/background_main.png')", // Ensure this path is correct
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", // Key for layout: title, form, buttons
};


export default function ArtefactAddClient() {
  const router = useRouter();

  // Component State
  const [isLeaving, setIsLeaving] = useState(false);
  const [sceneStyle, setSceneStyle] = useState<CSSProperties>({});
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);


  // Effect for handling window resize and maintaining aspect ratio
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
      const newPaddingValue = scaleToWidth(40, newWidth); // Original padding reference was 40px

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

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic sizing functions
  const dynamicFontSize = (originalPxSize: number): string => {
    return `${scaleToWidth(originalPxSize, currentSceneWidth)}px`;
  };

  const dynamicSize = (originalPxSize: number): string => {
    return `${scaleToWidth(originalPxSize, currentSceneWidth)}px`;
  };

  // Event Handlers
  const handleReturn = () => {
    setIsLeaving(true);
    setTimeout(() => {
      router.back(); // Go to the previous page
    }, 600); // Match animation duration
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFormError(null); // Clear error on new file selection
    }
  };

  const handleMediaTypeChange = (type: 'photo' | 'video' | 'audio') => {
    setMediaType(type);
    setFile(null); // Reset file when media type changes
    setFormError(null); // Clear error
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim() || !mediaType || !file) {
      setFormError("Please fill in all fields and select a file.");
      return;
    }

    console.log("Form Submitted:", { title, description, mediaType, fileName: file.name, fileType: file.type, fileSize: file.size });
    // TODO: Implement actual file upload and data submission logic here

    setIsLeaving(true);
    setTimeout(() => {
      // router.push('/artefacts'); // Or a success page
      console.log("Artefact soumis (simulation) et retour à la page précédente.");
      router.back(); 
    }, 600);
  };

  // Helper to get accept attribute for file input
  const getAcceptAttribute = () => {
    if (mediaType === 'photo') return 'image/*,.gif';
    if (mediaType === 'audio') return 'audio/*';
    if (mediaType === 'video') return 'video/*';
    return '';
  };

  // Design values for form elements
  const pageTitleFontSize = 55;
  const labelFontSize = 22;
  const inputFontSize = 20;
  const radioLabelFontSize = 18;
  const formElementsGap = 15; // Gap between form groups
  const buttonFontSize = 25;
  const buttonPaddingX = 24;
  const buttonPaddingY = 8;

  // Common styles for inputs and textarea
  const inputBaseStyle: CSSProperties = {
    width: '100%',
    padding: dynamicSize(12),
    borderRadius: dynamicSize(8),
    border: `1px solid ${dynamicSize(1)} rgba(255, 255, 255, 0.4)`,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Darker semi-transparent background
    color: "white", // White text for dark background
    fontSize: dynamicFontSize(inputFontSize),
    fontFamily: "'Faculty Glyphic', serif",
    marginTop: dynamicSize(8),
    boxSizing: 'border-box',
  };
  
  const activeRadioStyle: CSSProperties = {
    backgroundColor: "rgba(139, 69, 19, 0.8)", // #8B4513 with opacity
    color: "white",
    border: `2px solid white`,
  };

  const inactiveRadioStyle: CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: `2px solid transparent`,
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
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
          key="artefact-add-page-content"
          style={sceneStyle} // Applies dynamic width, height, padding, and background
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-black flex flex-col" // justify-between is in sceneStyle
        >
          {/* 1. Page Title */}
          <h1
            style={{
              fontSize: dynamicFontSize(pageTitleFontSize),
              fontFamily: "'Limelight', cursive",
              textAlign: 'center',
              color: "black", // Ensure title is visible
              paddingTop: dynamicSize(135), // Add some top padding if needed inside the scene padding
            }}
          >
            Add a New Artifact
          </h1>

          {/* 2. Form Area */}
          <form
            id="addArtefactForm"
            onSubmit={handleSubmit}
            className="flex flex-col items-center overflow-y-auto" // Centered items, vertical scroll
            style={{
              gap: dynamicSize(formElementsGap),
              flexGrow: 1, // Takes available vertical space
              width: '100%', // Takes full width within scene padding
              paddingTop: dynamicSize(30),
              paddingLeft: dynamicSize(30), // Inner padding for form content
              paddingRight: dynamicSize(30),
              boxSizing: 'border-box',
            }}
          >
                  {/* Title Field - Label à gauche */}
                  <div className="w-full max-w-xl flex flex-row items-center" style={{ gap: dynamicSize(10) }}> {/* Conteneur flex pour aligner label et input horizontalement */}
              <label
                htmlFor="artefactTitle"
                className="whitespace-nowrap" // Empêche le label de passer à la ligne
                style={{
                  fontSize: dynamicFontSize(labelFontSize),
                  fontFamily: "'Faculty Glyphic', serif",
                  // display: 'block' n'est plus nécessaire avec flex
                  // marginRight: dynamicSize(10) // Ajouté via le 'gap' sur le parent
                }}
              >
                Title :
              </label>
              <input
                type="text"
                id="artefactTitle"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setFormError(null);}}
                required
                style={{
                  ...inputBaseStyle, // Conserve le style de base de l'input
                  flexGrow: 1, // Permet à l'input de prendre l'espace restant
                  marginTop: 0, // Annule la marge supérieure si inputBaseStyle en avait une spécifique
                }}
                placeholder="Enter the title..."
              />
            </div>

            {/* Description Field */}
            <div className="w-full max-w-xl">
              <label
                htmlFor="artefactDescription"
                style={{ fontSize: dynamicFontSize(labelFontSize), fontFamily: "'Faculty Glyphic', serif", display: 'block' }}
              >
                Description :
              </label>
              <textarea
                id="artefactDescription"
                value={description}
                onChange={(e) => { setDescription(e.target.value); setFormError(null);}}
                required
                rows={4}
                style={{
                  ...inputBaseStyle,
                  height: dynamicSize(150), // Specific height for textarea
                  resize: 'none',
                }}
                placeholder="Describe your artifact..."
              />
            </div>

            {/* Media Type Selection */}
            <div className="w-full max-w-xl ">
              <span
                id="mediaTypeLabel" // For aria-labelledby
                style={{ fontSize: dynamicFontSize(labelFontSize), fontFamily: "'Faculty Glyphic', serif", display: 'block' }}
              >
                Média :
              </span>
              <div
                role="radiogroup"
                aria-labelledby="mediaTypeLabel"
                className="flex flex-col sm:flex-row justify-between mt-2"
                style={{ gap: dynamicSize(10) }}
              >
                {(['photo', 'video', 'audio'] as const).map((type) => (
                  <button // Using buttons for better styling control of radio-like options
                    type="button" // Important: prevent form submission
                    key={type}
                    onClick={() => handleMediaTypeChange(type)}
                    className="flex-1 p-3 rounded-lg transition-all duration-200 ease-in-out text-center"
                    style={{
                        fontSize: dynamicFontSize(radioLabelFontSize),
                        fontFamily: "'Faculty Glyphic', serif",
                        ...(mediaType === type ? activeRadioStyle : inactiveRadioStyle),
                        minWidth: dynamicSize(120), // Ensure buttons have some width
                        padding: `${dynamicSize(10)} ${dynamicSize(15)}`,
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload (Conditional) */}
            {mediaType && (
              <div className="w-full max-w-xl">
                <input
                  type="file"
                  id="artefactFile"
                  onChange={handleFileChange}
                  required
                  accept={getAcceptAttribute()}
                  style={{
                    ...inputBaseStyle,
                    padding: dynamicSize(8), // Adjust padding for file input if needed
                    backgroundColor: "rgba(255,255,255,0.1)", // Slightly different for file input
                  }}
                />
                 {file && <p style={{fontSize: dynamicFontSize(16), marginTop: dynamicSize(5), color: 'rgba(255,255,255,0.8)'}}>Fichier sélectionné: {file.name}</p>}
              </div>
            )}

            {/* Form Error Message */}
            {formError && (
                <p style={{ color: '#FF6B6B', fontSize: dynamicFontSize(18), textAlign: 'center', marginTop: dynamicSize(10) }}>
                    {formError}
                </p>
            )}
          </form>

          {/* 3. Action Buttons */}
          <div
            className="flex flex-col sm:flex-row justify-center items-center"
            style={{
              gap: dynamicSize(70),
              paddingBottom: dynamicSize(50), // Ensure buttons are not at the very edge
              paddingTop: dynamicSize(10), // Space above buttons
            }}
          >
            <button
              onClick={handleReturn}
              className="font-bold text-white rounded-full transition hover:opacity-80"
              style={{
                fontFamily: "'Faculty Glyphic', serif",
                fontSize: dynamicFontSize(buttonFontSize),
                padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                backgroundColor: "#8B4513", // Original brown for return
                minWidth: dynamicSize(300),
              }}
            >
              BACK
            </button>
            <button
              type="submit"
              form="addArtefactForm" // Links to the form
              className="font-bold text-white rounded-full transition hover:opacity-80"
              style={{
                fontFamily: "'Faculty Glyphic', serif",
                fontSize: dynamicFontSize(buttonFontSize),
                padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                backgroundColor: "#4CAF50", // Green for submit/validate
                minWidth: dynamicSize(300),
              }}
            >
              SUBMIT
            </button>
            
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
