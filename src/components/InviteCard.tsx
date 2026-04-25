"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import Countdown from "./Countdown";
import { 
  BRIDE_NAME, 
  GROOM_NAME, 
  WEDDING_DATE_ISO, 
  WEDDING_DATE_DISPLAY, 
  WEDDING_TIME_DISPLAY,
  WEDDING_DAY_DISPLAY,
  VENUE_NAME,
  VENUE_ADDRESS,
  VENUE_COORDINATES
} from "@/lib/constants";

// Dynamically import map to avoid SSR window issues
const VenueMap = dynamic(() => import("./VenueMap"), {
  ssr: false,
  loading: () => <div className="h-64 sm:h-80 w-full glass-card animate-pulse rounded-xl flex items-center justify-center text-white/50">Loading map...</div>
});

// Centralized wedding date
const weddingDate = WEDDING_DATE_ISO;

export default function InviteCard({ guestName, personalizedMessage }: { guestName?: string, personalizedMessage?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="glass-card relative z-10 p-6 sm:p-12 rounded-3xl max-w-2xl mx-auto w-full text-center"
    >
      <div className="mb-8">
        <h2 className="text-gold tracking-[0.3em] text-sm uppercase mb-4">Together with their families</h2>
        <h1 className="font-serif text-5xl sm:text-7xl mb-6 text-white drop-shadow-md">
          {BRIDE_NAME}
          <span className="block text-3xl sm:text-4xl text-gold-light my-2">&amp;</span>
          {GROOM_NAME}
        </h1>
        <p className="text-gold-light italic font-serif text-2xl mb-4">
          Dear {guestName || "Honored Guest"},
        </p>
        <p className="text-white/80 max-w-md mx-auto italic font-serif text-lg">
          {personalizedMessage || "Request the honor of your presence to celebrate their marriage."}
        </p>
      </div>

      <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
          <Calendar className="w-8 h-8 text-gold-light mb-3" />
          <p className="font-serif text-xl">{WEDDING_DATE_DISPLAY.replace(/^[a-zA-Z]+, /, '')}</p>
          <p className="text-white/60 text-sm">{WEDDING_DAY_DISPLAY}</p>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
          <Clock className="w-8 h-8 text-gold-light mb-3" />
          <p className="font-serif text-xl">{WEDDING_TIME_DISPLAY}</p>
          <p className="text-white/60 text-sm">Ceremony & Reception</p>
        </motion.div>
      </div>

      <Countdown targetDate={weddingDate} />

      <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-10" />

      <div className="mb-10 text-center flex flex-col items-center">
        <MapPin className="w-8 h-8 text-gold-light mb-3" />
        <h3 className="font-serif text-2xl mb-2">{VENUE_NAME}</h3>
        <p className="text-white/80 text-sm mb-6 max-w-xs leading-relaxed">
          {VENUE_ADDRESS}
        </p>
        
        <VenueMap position={VENUE_COORDINATES} name={VENUE_NAME} />
        
        <a 
          href="https://maps.google.com/?q=34.0736,-118.4004" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 inline-block border border-gold text-gold hover:bg-gold hover:text-navy transition-colors px-6 py-2 rounded-full text-sm uppercase tracking-wider"
        >
          Get Directions
        </a>
      </div>

    </motion.div>
  );
}
