"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isRightHovered, setIsRightHovered] = useState(false);
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false); // 👈 état pour le fondu

  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = () => {
    if (!validateEmail(email.trim())) {
      setError("Le format de l'email n'est pas valide.");
    } else {
      setError("");
      setShowModal(false);
      setIsLeaving(true); // 👈 déclenche le fondu
      setTimeout(() => {
        router.push(`/artefacts?email=${encodeURIComponent(email.trim())}`);
      }, 600); // 👈 doit correspondre à la durée du fondu
    }
  };

  return (
    <AnimatePresence mode="wait">
      <>
        {/* Fondu noir en sortie */}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-screen h-screen overflow-hidden bg-cover bg-center text-white"
          style={{
            backgroundImage: "url('/background_main.png')",
          }}
        >
          {/* Pop-up Email avec animation */}
          <AnimatePresence>
            {showModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black backdrop-blur-md z-40"
                />

                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center z-50"
                >
                  <div className="relative bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-xl text-center">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setError("");
                        setEmail("");
                      }}
                      className="absolute top-2 right-2 bg-[#8B4513] hover:bg-[#5C3210] text-white text-xl font-bold rounded-full px-3 py-1 transition"
                      aria-label="Fermer"
                    >
                      ×
                    </button>

                    <h2
                      className="text-xl font-bold mb-0 mt-5 text-black"
                      style={{ fontFamily: "'Faculty Glyphic', serif" }}
                    >
                      RECHERCHER / AJOUTER UTILISATEUR
                    </h2>
                    <h3
                      className="text-lg mb-8 mt-3 text-black"
                      style={{ fontFamily: "'Faculty Glyphic', serif" }}
                    >
                      Entrez votre email ou celui d'un ami
                    </h3>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@email.com"
                      className="w-full px-4 py-2 border rounded text-black"
                      style={{ fontFamily: "'Faculty Glyphic', serif" }}
                    />

                    {error && (
                      <p
                        className="text-red-600 text-sm mt-2"
                        style={{ fontFamily: "'Faculty Glyphic', serif" }}
                      >
                        {error}
                      </p>
                    )}

                    <button
                      onClick={handleSubmit}
                      className="mt-8 bg-[#8B4513] hover:bg-[#5C3210] rounded-full font-bold text-white px-6 py-2 rounded"
                      style={{ fontFamily: "'Faculty Glyphic', serif" }}
                    >
                      OUVRIR LA PORTE
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Titre et sous-titre */}
          <div className="absolute top-35 left-1/2 transform -translate-x-1/2 text-center w-[90%] max-w-5xl">
            <h1
              className="text-6xl font-bold drop-shadow-lg text-black"
              style={{ fontFamily: "Limelight, cursive" }}
            >
              The End Page Museum
            </h1>
            <p
              className="text-xl mt-5 drop-shadow-md text-black"
              style={{ fontFamily: "'Faculty Glyphic', serif" }}
            >
              AN ADVENTURE DOWN MEMORY LANE
            </p>
          </div>

          {/* Panneau gauche */}
          <button
            className="absolute bottom-60 left-[8%] bg-transparent border-none outline-none"
            onMouseEnter={() => setIsLeftHovered(true)}
            onMouseLeave={() => setIsLeftHovered(false)}
          >
            <img
              src={
                isLeftHovered ? "panneau_negatif_hover.png" : "panneau_negatif.png"
              }
              alt="Panneau gauche"
              className="w-80 h-auto hover:scale-110 transition"
            />
          </button>

          {/* Porte centrale */}
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-transparent border-none outline-none"
          >
            <img
              src="porte.png"
              alt="Porte centrale"
              className="h-100 h-auto hover:scale-110 transition"
            />
          </button>

          {/* Panneau droit */}
          <button
            className="absolute bottom-60 right-[8%] bg-transparent border-none outline-none"
            onMouseEnter={() => setIsRightHovered(true)}
            onMouseLeave={() => setIsRightHovered(false)}
          >
            <img
              src={
                isRightHovered ? "panneau_positif_hover.png" : "panneau_positif.png"
              }
              alt="Panneau droite"
              className="w-80 h-auto hover:scale-110 transition"
            />
          </button>
        </motion.div>
      </>
    </AnimatePresence>
  );
}