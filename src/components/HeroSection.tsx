"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bell, Music, Music2, ChevronDown, VolumeX, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { BRIDE_NAME, GROOM_NAME, WEDDING_DATE_DISPLAY } from "@/lib/constants";

export default function HeroSection({
  brideName = BRIDE_NAME,
  groomName = GROOM_NAME,
  weddingDate = WEDDING_DATE_DISPLAY,
  isActive = false
}: {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  isActive?: boolean;
}) {
  // Start playing by default when active
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play audio upon the hero section rendering (since user has already interacted with cover page)
  useEffect(() => {
    if (audioRef.current && isActive) {
      audioRef.current.volume = 0.15; // Extremely low, ambient volume suitable for weddings
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.log("Autoplay blocked: ", e);
        setIsPlaying(false);
      });
    } else if (audioRef.current && !isActive) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative w-full h-[100dvh] bg-charcoal overflow-hidden flex flex-col items-center justify-center">
      
      {/* Hidden Audio Element - Replace /music.mp3 in public/ with your preferred wedding track */}
      <audio ref={audioRef} src="/music.mp3" loop />
      
      {/* Cinematic Background Image */}
      <Image 
        src="/couple.png"
        alt="The Happy Couple"
        fill
        className="object-cover opacity-80"
        priority
      />

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-0" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 text-white text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="glass border border-white/20 rounded-full px-6 py-2.5 flex items-center justify-center gap-3 backdrop-blur-sm mb-8"
        >
          <Bell className="w-4 h-4 text-white/80" />
          <span className="text-xs sm:text-sm font-sans tracking-[0.25em] uppercase text-white/90">
            We're Getting Married
          </span>
          <Bell className="w-4 h-4 text-white/80" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-3xl sm:text-7xl lg:text-8xl font-sans tracking-wide font-light drop-shadow-lg">
            {brideName} <span className="font-serif italic">&amp;</span>
          </h1>
          <h1 className="text-3xl sm:text-7xl lg:text-8xl font-sans tracking-wide font-light drop-shadow-lg mt-2 mb-6">
            {groomName}
          </h1>
          
          <p className="text-sm sm:text-base font-serif italic tracking-widest text-white/80 mt-4 drop-shadow-md">
            {weddingDate}
          </p>
        </motion.div>
      </div>

      {/* Bottom Interface Elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center"
      >
        <span className="text-xs font-sans uppercase tracking-[0.15em] text-white/60 mb-2">
          Swipe up for more
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </motion.div>

      {/* Floating Music Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        onClick={toggleMusic}
        className={`absolute bottom-8 right-6 z-30 w-12 h-12 backdrop-blur-md rounded-full border flex items-center justify-center transition-colors ${
          isPlaying 
            ? 'bg-black/40 border-gold/50 text-gold-light hover:bg-black/60' 
            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        }`}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-light rounded-full animate-ping" />
        )}
      </motion.button>
      
    </section>
  );
}
