"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function ArtefactsClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "Inconnu";
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);
  const items = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleReturn = () => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  return (
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
          key="artefacts-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-screen h-screen overflow-hidden bg-cover bg-center text-white flex flex-col justify-between"
          style={{
            backgroundImage:
              "url('https://www.madame-oreille.com/wp-content/uploads/2012/02/vignette_photographier_musee.jpg')",
          }}
        >
          <div
            className="text-center text-black font-bold text-5xl mt-20"
            style={{ fontFamily: "Limelight, cursive" }}
          >
            ARTEFACTS
          </div>
          <div
            className="text-center text-black font-bold text-4xl -mt-8"
            style={{ fontFamily: "'Faculty Glyphic', serif" }}
          >
            {email}
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-5 gap-20 my-10">
              {items.map((item) => (
                <div
                  key={item}
                  className="w-40 h-40 bg-white/50 rounded-xl shadow-lg hover:scale-105 transition"
                />
              ))}
            </div>
          </div>

          <div className="text-center mb-20">
            <button
              onClick={handleReturn}
              className="bg-[#8B4513] hover:bg-[#5C3210] font-bold text-white px-6 py-2 rounded-full transition"
              style={{ fontFamily: "'Faculty Glyphic', serif" }}
            >
              RETOUR À L&apos;ACCUEIL
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
