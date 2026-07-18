"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BRIDE_NAME, GROOM_NAME } from "@/lib/constants";

export default function CoverPage({
  guestName,
  onOpen,
  eventType = "wedding",
}: {
  guestName: string;
  onOpen: () => void;
  eventType?: string;
}) {
  const invitationText = eventType === "homecoming"
    ? "You Are Invited To The Homecoming Of"
    : "You Are Invited To The Wedding Of";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${eventType === "homecoming" ? "bg-red-200" : "bg-sand-light"} p-4`}
    >
      {/* Google Font link for Great Vibes */}
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
        rel="stylesheet"
      />

      <div className={`relative w-full max-w-sm sm:max-w-md aspect-[3/5] ${eventType === "homecoming" ? "bg-red-100" : "bg-sand"} shadow-2xl rounded-sm overflow-hidden flex flex-col items-center justify-center text-charcoal text-center px-8 border border-black/5`}>

        {/* Top Left Decorative Pattern */}
        <div className={`absolute top-0 left-0 w-32 h-32 opacity-60 ${eventType === "homecoming" ? "text-red-600" : "text-gold-light"}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0C55.2285 0 100 44.7715 100 100H0V0Z" fill="currentColor" opacity="0.3" />
            <path d="M0 0C44.1828 0 80 35.8172 80 80H0V0Z" fill="currentColor" opacity="0.5" />
            <path d="M0 0C33.1371 0 60 26.8629 60 60H0V0Z" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-8">

          {/* Top Section: Guest & Invitation Text */}
          <div className="flex flex-col items-center justify-start mt-6">
            <h2 className="text-xs sm:text-sm font-medium tracking-[0.3em] font-sans text-charcoal/60 uppercase mb-2">
              Dear
            </h2>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4 border-b border-gold/30 pb-2 min-w-[120px]">
              {guestName}
            </h3>

            <p className="text-[10px] sm:text-xs font-medium tracking-widest text-charcoal/80 mb-4 uppercase max-w-[220px] leading-relaxed">
              {invitationText}
            </p>

            {/* Couple Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg border-2 border-white">
              <Image
                src="/couple-2.JPG"
                alt="The Happy Couple"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Middle Section: Couple Names (Exact image_fe9aef.png style) */}
          <div className="flex flex-col items-center justify-center my-auto py-2">

            {/* Bride Name */}
            <h1
              className="text-5xl sm:text-6xl text-charcoal font-normal tracking-normal leading-tight"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              {eventType === "homecoming" ? GROOM_NAME : BRIDE_NAME}
            </h1>

            {/* Ampersand (&) */}
            <span className="text-2xl my-1 font-serif italic text-charcoal/50">&</span>

            {/* Groom Name */}
            <h1
              className="text-5xl sm:text-6xl text-charcoal font-normal tracking-normal leading-tight"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              {eventType === "homecoming" ? BRIDE_NAME : GROOM_NAME}
            </h1>

          </div>

          {/* Bottom Section: Button */}
          <div className="flex flex-col items-center justify-end pb-4">
            <button
              onClick={onOpen}
              className={eventType === "homecoming" ? "px-8 py-4 rounded-full bg-red-800 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.25em] hover:bg-red-700 transition-all duration-300 active:scale-95 shadow-md shadow-red-800/20" : "px-8 py-4 rounded-full bg-gold text-white text-xs sm:text-sm font-bold uppercase tracking-[0.25em] hover:bg-gold-light transition-all duration-300 active:scale-95 shadow-md shadow-gold/20"}
            >
              View Invitation
            </button>
          </div>

        </div>

        {/* Bottom Right Decorative Pattern */}
        <div className={`absolute bottom-0 right-0 w-32 h-32 opacity-60 ${eventType === "homecoming" ? "text-red-600" : "text-gold-light"} transform rotate-180`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0C55.2285 0 100 44.7715 100 100H0V0Z" fill="currentColor" opacity="0.3" />
            <path d="M0 0C44.1828 0 80 35.8172 80 80H0V0Z" fill="currentColor" opacity="0.5" />
            <path d="M0 0C33.1371 0 60 26.8629 60 60H0V0Z" fill="currentColor" />
          </svg>
        </div>

      </div>
    </motion.div>
  );
}