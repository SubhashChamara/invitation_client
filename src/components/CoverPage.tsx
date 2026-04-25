"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BRIDE_NAME, GROOM_NAME } from "@/lib/constants";

export default function CoverPage({
  guestName,
  onOpen,
}: {
  guestName: string;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-sand-light p-4"
    >
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/5] bg-sand shadow-2xl rounded-sm overflow-hidden flex flex-col items-center justify-center text-charcoal text-center px-8 border border-black/5">
        
        {/* Top Left Decorative Pattern Placeholders (can be replaced by images later) */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-60 text-gold-light">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0C55.2285 0 100 44.7715 100 100H0V0Z" fill="currentColor" opacity="0.3"/>
            <path d="M0 0C44.1828 0 80 35.8172 80 80H0V0Z" fill="currentColor" opacity="0.5"/>
            <path d="M0 0C33.1371 0 60 26.8629 60 60H0V0Z" fill="currentColor"/>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full py-12">
          
          <div className="flex-1 flex flex-col items-center justify-start mt-10">
            <h2 className="text-xs sm:text-sm font-medium tracking-[0.3em] font-sans text-charcoal/60 uppercase mb-2">
              Dear
            </h2>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-6 border-b border-gold/30 pb-2 min-w-[120px]">
              {guestName}
            </h3>
            
            <p className="text-xs sm:text-sm font-medium tracking-widest text-charcoal/80 mb-2 leading-relaxed max-w-[200px]">
              You Are Invited To The Wedding Of
            </p>

            {/* Couple Image Added Here */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg border-2 border-white mb-2">
              <Image 
                src="/couple.png" 
                alt="The Happy Couple" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mt-4 mb-4">
            <h1 className="text-5xl sm:text-6xl font-script tracking-tight text-charcoal">
              {BRIDE_NAME}
            </h1>
            <span className="text-2xl my-1 font-serif text-charcoal/50">&amp;</span>
            <h1 className="text-5xl sm:text-6xl font-script tracking-tight text-charcoal">
              {GROOM_NAME}
            </h1>
          </div>

          <div className="flex-1 flex flex-col items-center justify-end pb-8">
            <button
              onClick={onOpen}
              className="px-8 py-4 rounded-full bg-gold text-white text-xs sm:text-sm font-bold uppercase tracking-[0.25em] hover:bg-gold-light transition-all duration-300 active:scale-95 shadow-md shadow-gold/20"
            >
              View Invitation
            </button>
          </div>
          
        </div>

        {/* Bottom Right Decorative Pattern Placeholders */}
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-60 text-gold-light transform rotate-180">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0C55.2285 0 100 44.7715 100 100H0V0Z" fill="currentColor" opacity="0.3"/>
            <path d="M0 0C44.1828 0 80 35.8172 80 80H0V0Z" fill="currentColor" opacity="0.5"/>
            <path d="M0 0C33.1371 0 60 26.8629 60 60H0V0Z" fill="currentColor"/>
          </svg>
        </div>

      </div>
    </motion.div>
  );
}
