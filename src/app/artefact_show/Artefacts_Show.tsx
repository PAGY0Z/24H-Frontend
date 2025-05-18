"use client";

import React, { useState, useEffect, CSSProperties, useRef, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParams ajouté
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// Importation des composants d'artefacts
// Assurez-vous que ces chemins sont corrects pour votre structure de projet.
import VideoArtefact from '@/app/components/Artefacts/VideoArtefact';
import PhotoArtefact from '@/app/components/Artefacts/PhotoArtefact';
import MusicArtefact from '@/app/components/Artefacts/MusicArtefact';

// Types pour les données des artefacts
type ArtefactType = 'video' | 'photo' | 'audio'; // Doit être en minuscules pour correspondre à la logique du switch
type ArtefactTypeState = ArtefactType | null;

// Interface pour les données brutes de l'API
interface ApiArtefactResponse {
  id: string | number;
  votecount: number;
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
  // Ajoutez d'autres champs si votre API les retourne et que vous en avez besoin
}

// Interface pour les données transformées utilisées par le frontend
interface ArtefactData {
  id?: string | number;
  type?: ArtefactTypeState;
  title?: string;
  description?: string;
  thumbnailUrl?: string;   // Pour Vidéo (construit à partir de filepath)
  videoUrl?: string;       // Pour Vidéo (URL réelle, si disponible)
  photoUrl?: string;       // Pour Photo (construit à partir de filepath)
  musicImageUrl?: string;  // Pour Audio (construit à partir de filepath, ou défaut)
  initialVotes?: number;
  userHasVoted?: boolean;  // Pour l'instant, nous allons le laisser à false par défaut
  author?: string;
}

// Résolution de design de référence
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080; // Ratio 16:9

// URL de base de votre backend pour les assets et l'API
const BACKEND_BASE_URL = "https://backend.qwerteam.lareunion.webcup.hodi.host";


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
  const searchParams = useSearchParams(); // Pour lire l'ID de l'URL

  const [isLeaving, setIsLeaving] = useState(false);
  const [sceneStyle, setSceneStyle] = useState<CSSProperties>({});
  const [currentSceneWidth, setCurrentSceneWidth] = useState<number>(DESIGN_WIDTH);

  // États pour les données de l'artefact, le chargement et les erreurs
  const [artefactTitle, setArtefactTitle] = useState("Chargement...");
  const [artefactDescription, setArtefactDescription] = useState("Veuillez patienter...");
  const [currentArtefactType, setCurrentArtefactType] = useState<ArtefactTypeState>(null);
  const [currentArtefactData, setCurrentArtefactData] = useState<ArtefactData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour le système de vote
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

    // Fonction pour charger les détails de l'artefact spécifique depuis l'API
    const fetchArtefactDetails = async () => {
      const artefactId = searchParams.get("id");
      console.log(artefactId); // ici il n'as jamais imprimé artefact id
      

      if (!artefactId) {
        setError("ID de l'artefact manquant dans l'URL.");
        setIsLoading(false);
        setArtefactTitle("Erreur");
        setArtefactDescription("Aucun ID d'artefact fourni.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/artifacts/${artefactId}`);
        console.log(response);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Artefact non trouvé");
          }
          throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
        }
        
        const apiData: ApiArtefactResponse = await response.json();

        // Transformation des données de l'API
        const artefactTypeApi = apiData.artyfactType.toLowerCase() as ArtefactType;
        let imageUrl: string | undefined = undefined;

        if (apiData.filepath) {
          if (apiData.filepath.startsWith('http://') || apiData.filepath.startsWith('https://')) {
            imageUrl = apiData.filepath;
          } else {
            const path = apiData.filepath.startsWith('/') ? apiData.filepath : `/${apiData.filepath}`;
            imageUrl = `https://qwerteam.lareunion.webcup.hodi.host${path}`;
          }
        }
        
        const transformedData: ArtefactData = {
          id: apiData.id,
          type: artefactTypeApi,
          title: apiData.title,
          description: apiData.description,
          initialVotes: apiData.votecount,
          author: apiData.author,
          userHasVoted: false, // TODO: Logique à implémenter si vous stockez les votes par utilisateur
        };

        switch (artefactTypeApi) {
          case 'video':
            transformedData.thumbnailUrl = imageUrl;
            // transformedData.videoUrl = imageUrl; // Si filepath est la vidéo elle-même
            break;
          case 'photo':
            transformedData.photoUrl = imageUrl;
            break;
          case 'audio':
            // Si filepath est une image pour l'audio, l'utiliser.
            // Sinon, musicImageUrl restera undefined et le composant utilisera son défaut.
            transformedData.musicImageUrl = imageUrl;
            break;
        }
        
        setArtefactTitle(transformedData.title || "Titre Indisponible");
        setArtefactDescription(transformedData.description || "Description Indisponible.");
        setCurrentArtefactType(transformedData.type || null);
        setCurrentArtefactData(transformedData);
        setTotalVotes(transformedData.initialVotes || 0);
        // setHasVoted(transformedData.userHasVoted || false); // À gérer si l'API renvoie cette info

      } catch (err) {
        console.error("Erreur lors du chargement des détails de l'artefact:", err);
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Une erreur inconnue est survenue lors du chargement.");
        }
        setArtefactTitle("Erreur de chargement");
        setArtefactDescription(`Impossible de récupérer les détails de l'artefact`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtefactDetails();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [searchParams]); // Se ré-exécute si l'ID dans l'URL change

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

  const handleSupportMemory = async () => {
    if (!hasVoted && currentArtefactData.id) {
      console.log("Support this memory clicked! Artefact ID:", currentArtefactData.id);
      // Optimistic UI update
      setHasVoted(true);
      setTotalVotes(prevTotalVotes => prevTotalVotes + 1);

      try {
        // TODO: Adaptez l'URL et la méthode pour votre API de vote
        const response = await fetch(`${BACKEND_BASE_URL}/api/artifacts/${currentArtefactData.id}/vote`, { 
          method: 'POST', // ou 'PUT', selon votre API
          // headers: { 'Content-Type': 'application/json', /* Autres headers si besoin */ },
          // body: JSON.stringify({ /* Données du vote si besoin */ })
        });
        if (!response.ok) {
          // Si l'API échoue, annuler le vote localement
          setHasVoted(false);
          setTotalVotes(prevTotalVotes => prevTotalVotes - 1);
          throw new Error(`Erreur API lors du vote: ${response.statusText}`);
        }
        // Optionnel: Mettre à jour avec les données de la réponse si l'API renvoie le nouveau total de votes
        // const voteResult = await response.json();
        // setTotalVotes(voteResult.newVoteCount); 
        console.log("Vote enregistré avec succès via API.");
      } catch (voteError) {
        console.error("Erreur lors de l'enregistrement du vote:", voteError);
        // L'UI a déjà été annulée
        // Afficher un message d'erreur à l'utilisateur si nécessaire
      }
    }
  };
  
  const infoBoxPadding = 20;
  const titleFontSize = 30;
  const descriptionFontSize = 20;
  const buttonPaddingX = 24;
  const buttonPaddingY = 8;
  const buttonFontSize = 25;
  const likeIconSize = 30;

  // Fonction pour rendre l'artefact principal
  const renderMainArtefact = (): ReactNode => {
    const artefactDisplayWidth = dynamicSize(ARTEFACT_PLACEHOLDER_DESIGN_WIDTH);
    const artefactDisplayHeight = dynamicSize(ARTEFACT_PLACEHOLDER_DESIGN_HEIGHT);

    const handleArtefactDisplayClick = () => {
      console.log(`Artefact ${currentArtefactType} cliqué:`, currentArtefactData);
      // Logique pour interagir avec l'artefact (ex: jouer vidéo, agrandir photo)
      if (currentArtefactType === 'video' && currentArtefactData.videoUrl) {
        // Exemple: ouvrir la vidéo dans un nouvel onglet ou un lecteur modal
        // window.open(currentArtefactData.videoUrl, '_blank');
        alert(`Lecture de la vidéo : ${currentArtefactData.videoUrl} (simulation)`);
      }
    };

    if (isLoading) {
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
    
    if (error || !currentArtefactType) {
       return (
        <div style={{
            width: artefactDisplayWidth, height: artefactDisplayHeight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.7)', borderRadius: dynamicSize(8),
            border: `${dynamicSize(1)} dashed rgba(0,0,0,0.4)`, fontFamily: "'Faculty Glyphic', serif",
            textAlign: 'center', padding: dynamicSize(20), fontSize: dynamicFontSize(18)
        }}>
          {error ? `Erreur: ${error}` : "Aucun artefact à afficher."}
        </div>
      );
    }


    switch (currentArtefactType) {
      case 'video':
        return (
          <VideoArtefact
            thumbnailUrl={currentArtefactData.thumbnailUrl}
            videoFrameUrl="/video.png" // Cadre par défaut
            width={artefactDisplayWidth}
            height={artefactDisplayHeight}
            altText={artefactTitle}
            onClick={handleArtefactDisplayClick}
          />
        );
      case 'photo':
        return (
          <PhotoArtefact
            photoUrl={currentArtefactData.photoUrl}
            photoFrameUrl="/cadre_photo.png" // Cadre par défaut
            width={artefactDisplayWidth}
            height={artefactDisplayHeight}
            altText={artefactTitle}
            onClick={handleArtefactDisplayClick}
          />
        );
      case 'audio':
        return (
          <MusicArtefact
            musicImageUrl={currentArtefactData.musicImageUrl || "/musique.png"} // Image spécifique ou défaut
            width={artefactDisplayWidth}
            height={artefactDisplayHeight}
            altText={artefactTitle}
            onClick={handleArtefactDisplayClick}
          />
        );
      default:
        const _exhaustiveCheck: never = currentArtefactType;
        console.warn("Type d'artefact inconnu dans renderMainArtefact:", _exhaustiveCheck);
        return <div style={{color: 'red'}}>Erreur: Type d&apos;artefact non supporté.</div>;
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black padding-20"> {/* padding-20 classe personnalisée? */}
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
              className="flex items-center justify-center bg-transparent rounded-xl"
              style={{
                width: dynamicSize(ARTEFACT_PLACEHOLDER_DESIGN_WIDTH + 20),
              }}
            >
              {renderMainArtefact()}
            </div>

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
                {artefactTitle}
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
                  {artefactDescription}
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
              AI REVIEW
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
