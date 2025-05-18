"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Design reference resolution (16:9 ratio)
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

// Backend URL
const BACKEND_API_URL = "https://backend.qwerteam.lareunion.webcup.hodi.host/api";

// Utility functions for responsive scaling
const scaleToWidth = (originalPx: number, currentSceneWidth: number): number => {
  return (originalPx / DESIGN_WIDTH) * currentSceneWidth;
};

// Initial scene style (background, layout)
const initialSceneStyleBase: Omit<CSSProperties, 'width' | 'height' | 'padding' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight'> = {
  position: "relative",
  overflow: "hidden",
  backgroundImage: "url('/background_main.png')", // Ensure this path is correct
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", 
};


export default function ArtefactAddClient() {
  const router = useRouter();

  // Component State
  const [isLeaving, setIsLeaving] = useState(false);
  const [sceneStyle, setSceneStyle] = useState<CSSProperties>({});
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state during submission

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [userEmail, setUserEmail] = useState(""); // New state for user email
  const [sentimentType, setSentimentType] = useState<'positive' | 'negative' | null>(null); // New state for sentiment
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


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
      router.back(); 
    }, 600); 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFormError(null); 
      setSuccessMessage(null);
    }
  };

  const handleMediaTypeChange = (type: 'photo' | 'video' | 'audio') => {
    setMediaType(type);
    setFile(null); 
    setFormError(null);
    setSuccessMessage(null);
  };

  const handleSentimentTypeChange = (type: 'positive' | 'negative') => {
    setSentimentType(type);
    setFormError(null);
    setSuccessMessage(null);
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!title.trim() || !description.trim() || !mediaType || !file || !userEmail.trim() || !sentimentType) {
      setFormError("Please fill in all fields, select a file, and choose a sentiment.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', userEmail); // 'author' from userEmail field
    formData.append('artyfactType', mediaType.toUpperCase()); // Convert to uppercase for backend
    formData.append('description', description);
    formData.append('isPositive', (sentimentType === 'positive').toString());
    formData.append('isNegative', (sentimentType === 'negative').toString());
    formData.append('file', file);
    // 'emoji' and 'votecount' are not collected, backend should handle defaults or optionality

    try {
      const response = await fetch(`${BACKEND_API_URL}/artifacts/`, {
        method: 'POST',
        body: formData,
        // Headers are not typically needed for FormData with fetch, 
        // the browser sets 'Content-Type': 'multipart/form-data' automatically.
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ description: "Unknown API error" }));
        throw new Error(errorData.description || `API Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Artifact created successfully:", result);
      setSuccessMessage("Artifact submitted successfully!");
      
      // Reset form or navigate
      setTitle("");
      setDescription("");
      setMediaType(null);
      setFile(null);
      setUserEmail("");
      setSentimentType(null);

      setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          router.back(); 
        }, 600);
      }, 1500); // Show success message for a bit

    } catch (error) {
      console.error("Form Submission Error:", error);
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
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
  const formElementsGap = 15; 
  const buttonFontSize = 25;
  const buttonPaddingX = 24;
  const buttonPaddingY = 8;

  const inputBaseStyle: CSSProperties = {
    width: '100%',
    padding: dynamicSize(12),
    borderRadius: dynamicSize(8),
    border: `1px solid ${dynamicSize(1)} rgba(255, 255, 255, 0.4)`,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
    fontSize: dynamicFontSize(inputFontSize),
    fontFamily: "'Faculty Glyphic', serif",
    marginTop: dynamicSize(8),
    boxSizing: 'border-box',
  };
  
  const activeRadioStyle: CSSProperties = {
    backgroundColor: "rgba(139, 69, 19, 0.8)", 
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
          style={sceneStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-black flex flex-col"
        >
          <h1
            style={{
              fontSize: dynamicFontSize(pageTitleFontSize),
              fontFamily: "'Limelight', cursive",
              textAlign: 'center',
              color: "black", 
              paddingTop: dynamicSize(20), // Adjusted padding
              paddingBottom: dynamicSize(20), // Added padding below title
            }}
          >
            Add New Artifact
          </h1>

          <form
            id="addArtefactForm"
            onSubmit={handleSubmit}
            className="flex flex-col items-center overflow-y-auto"
            style={{
              gap: dynamicSize(formElementsGap),
              flexGrow: 1, 
              width: '100%', 
              maxWidth: dynamicSize(DESIGN_WIDTH), // Limit form width for better readability
              paddingLeft: dynamicSize(20), 
              paddingRight: dynamicSize(20),
              boxSizing: 'border-box',
            }}
          >
            {/* User Email Field */}
            <div className="w-full">
              <label
                htmlFor="userEmail"
                style={{ fontSize: dynamicFontSize(labelFontSize), fontFamily: "'Faculty Glyphic', serif", display: 'block', color: "black" }}
              >
                User Email:
              </label>
              <input
                type="email"
                id="userEmail"
                value={userEmail}
                onChange={(e) => { setUserEmail(e.target.value); setFormError(null); setSuccessMessage(null);}}
                required
                style={{...inputBaseStyle, color: "black", backgroundColor: "rgba(255, 255, 255, 0.7)"}} // Lighter background for better contrast
                placeholder="Enter your email..."
              />
            </div>
            
            {/* Title Field */}
            <div className="w-full">
              <label
                htmlFor="artefactTitle"
                style={{ fontSize: dynamicFontSize(labelFontSize), fontFamily: "'Faculty Glyphic', serif", display: 'block', color: "black" }}
              >
                Title:
              </label>
              <input
                type="text"
                id="artefactTitle"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setFormError(null); setSuccessMessage(null);}}
                required
                style={{...inputBaseStyle, color: "black", backgroundColor: "rgba(255, 255, 255, 0.7)"}}
                placeholder="Enter the title..."
              />
            </div>

            {/* Description Field */}
            <div className="w-full">
              <label
                htmlFor="artefactDescription"
                style={{ fontSize: dynamicFontSize(labelFontSize), fontFamily: "'Faculty Glyphic', serif", display: 'block', color: "black" }}
              >
                Description:
              </label>
              <textarea
                id="artefactDescription"
                value={description}
                onChange={(e) => { setDescription(e.target.value); setFormError(null); setSuccessMessage(null);}}
                required
                rows={3} // Reduced rows
                style={{
                  ...inputBaseStyle,
                  height: dynamicSize(120), 
                  resize: 'none',
                  color: "black", backgroundColor: "rgba(255, 255, 255, 0.7)"
                }}
                placeholder="Describe your artifact..."
              />
            </div>

            {/* Sentiment Type Selection */}
            <div className="w-full">
              <span
                id="sentimentTypeLabel"
                style={{ fontSize: dynamicFontSize(labelFontSize), fontFamily: "'Faculty Glyphic', serif", display: 'block', color: "black" }}
              >
                Sentiment:
              </span>
              <div
                role="radiogroup"
                aria-labelledby="sentimentTypeLabel"
                className="flex flex-row justify-start mt-2" // Changed to flex-row and justify-start
                style={{ gap: dynamicSize(20) }} // Increased gap
              >
                {(['positive', 'negative'] as const).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleSentimentTypeChange(type)}
                    className="p-3 rounded-lg transition-all duration-200 ease-in-out text-center"
                    style={{
                        fontSize: dynamicFontSize(radioLabelFontSize),
                        fontFamily: "'Faculty Glyphic', serif",
                        ...(sentimentType === type ? activeRadioStyle : inactiveRadioStyle),
                        minWidth: dynamicSize(150), // Adjusted minWidth
                        padding: `${dynamicSize(10)} ${dynamicSize(20)}`,
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Type Selection */}
            <div className="w-full">
              <span
                id="mediaTypeLabel"
                style={{ fontSize: dynamicFontSize(labelFontSize), fontFamily: "'Faculty Glyphic', serif", display: 'block', color: "black" }}
              >
                Media Type:
              </span>
              <div
                role="radiogroup"
                aria-labelledby="mediaTypeLabel"
                className="flex flex-col sm:flex-row justify-between mt-2"
                style={{ gap: dynamicSize(10) }}
              >
                {(['photo', 'video', 'audio'] as const).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleMediaTypeChange(type)}
                    className="flex-1 p-3 rounded-lg transition-all duration-200 ease-in-out text-center"
                    style={{
                        fontSize: dynamicFontSize(radioLabelFontSize),
                        fontFamily: "'Faculty Glyphic', serif",
                        ...(mediaType === type ? activeRadioStyle : inactiveRadioStyle),
                        minWidth: dynamicSize(120),
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
              <div className="w-full">
                <label
                  htmlFor="artefactFile"
                  style={{ fontSize: dynamicFontSize(labelFontSize), fontFamily: 'Faculty Glyphic, serif', display: 'block', color: 'black', marginBottom: dynamicSize(8) }}
                >
                  Upload File:
                </label>
                <input
                  type="file"
                  id="artefactFile"
                  onChange={handleFileChange}
                  required
                  accept={getAcceptAttribute()}
                  style={{
                    ...inputBaseStyle,
                    padding: dynamicSize(8),
                    backgroundColor: "rgba(255,255,255,0.7)", // Lighter for file input
                    color: "black", // Text color for file input
                  }}
                />
                {file && <p style={{ fontSize: dynamicFontSize(16), marginTop: dynamicSize(5), color: 'rgba(0,0,0,0.8)' }}>Selected: {file.name}</p>}
              </div>
            )}

            {/* Form Error/Success Message */}
            {formError && (
                <p style={{ color: '#D8000C', backgroundColor: '#FFD2D2', padding: dynamicSize(10), borderRadius: dynamicSize(5), fontSize: dynamicFontSize(18), textAlign: 'center', marginTop: dynamicSize(10), width: '100%' }}>
                    {formError}
                </p>
            )}
            {successMessage && (
                <p style={{ color: '#4F8A10', backgroundColor: '#DFF2BF', padding: dynamicSize(10), borderRadius: dynamicSize(5), fontSize: dynamicFontSize(18), textAlign: 'center', marginTop: dynamicSize(10), width: '100%' }}>
                    {successMessage}
                </p>
            )}
          </form>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row justify-center items-center"
            style={{
              gap: dynamicSize(70),
              paddingBottom: dynamicSize(30), // Adjusted padding
              paddingTop: dynamicSize(20), 
            }}
          >
            <button
              onClick={handleReturn}
              className="font-bold text-white rounded-full transition hover:opacity-80"
              style={{
                fontFamily: "'Faculty Glyphic', serif",
                fontSize: dynamicFontSize(buttonFontSize),
                padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                backgroundColor: "#8B4513", 
                minWidth: dynamicSize(250), // Adjusted minWidth
              }}
            >
              BACK
            </button>
            <button
              type="submit"
              form="addArtefactForm"
              disabled={isSubmitting} // Disable button while submitting
              className="font-bold text-white rounded-full transition hover:opacity-80"
              style={{
                fontFamily: "'Faculty Glyphic', serif",
                fontSize: dynamicFontSize(buttonFontSize),
                padding: `${dynamicSize(buttonPaddingY)} ${dynamicSize(buttonPaddingX)}`,
                backgroundColor: isSubmitting ? "#cccccc" : "#4CAF50", 
                minWidth: dynamicSize(250), // Adjusted minWidth
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
