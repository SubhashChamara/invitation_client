"use client";

import { motion } from "framer-motion";
import { Scroll, MapPin } from "lucide-react";
import { 
  WEDDING_DATE_DISPLAY, 
  VENUE_NAME, 
  HOMECOMING_DATE_DISPLAY, 
  HOMECOMING_VENUE_NAME,
  WEDDING_TIME_DISPLAY,
  HOMECOMING_TIME_DISPLAY
} from "@/lib/constants";

export default function EventCards({
  onLocationClick,
  eventType
}: {
  onLocationClick?: () => void;
  eventType?: string;
}) {
  const title = eventType === "homecoming" ? "Homecoming Party" : "Poruwa Ceremony";
  const date = eventType === "homecoming" ? HOMECOMING_DATE_DISPLAY : WEDDING_DATE_DISPLAY;
  const venue = eventType === "homecoming" ? HOMECOMING_VENUE_NAME : VENUE_NAME;
  const time = eventType === "homecoming" ? HOMECOMING_TIME_DISPLAY : WEDDING_TIME_DISPLAY;

  return (
    <section className={`w-full ${eventType === "homecoming" ? "bg-[#faf9f6]" : "bg-white"} pb-24 px-4 flex flex-col items-center relative z-10`}>
      
      {/* 
        This is the container for the event cards.
        Currently it shows the Poruwa Ceremony.
      */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl bg-sand rounded-[32px] p-8 sm:p-10 shadow-sm border border-charcoal/5 flex flex-col items-start text-left"
      >
        {/* Top Icon Badge */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-8 shadow-inner transition-colors duration-500 ${
          eventType === "homecoming" ? "bg-red-800" : "bg-[#b89e95]"
        }`}>
          <Scroll className="w-8 h-8 stroke-[1.5]" />
        </div>

        <h3 className="text-[28px] sm:text-3xl font-serif text-charcoal mb-5">
          {title}
        </h3>
        
        <div className="space-y-3 mb-8">
          <p className="text-charcoal/80 font-sans sm:text-lg">
            {date}
          </p>
          <p className="text-charcoal/60 font-sans text-sm sm:text-base">
            {time} onwards
          </p>
          <p className="text-charcoal/80 font-sans font-medium pt-2">
            {venue}
          </p>
          <p className="text-charcoal/60 font-sans text-sm pb-1">
            Grand Ballroom
          </p>
          <p className="text-charcoal/50 font-serif italic text-sm pt-2 leading-relaxed max-w-[280px]">
            If you need any further information, please don't hesitate to reach out to us
          </p>
        </div>

        <button 
          onClick={onLocationClick}
          className={`w-full text-white py-4 rounded-full font-bold uppercase tracking-[0.15em] text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md transition-all active:scale-[0.98] ${
            eventType === "homecoming" 
              ? "bg-red-800 hover:bg-crimson-luxury shadow-burgundy/25" 
              : "bg-gold hover:bg-gold-light shadow-gold/20"
          }`}
        >
          <MapPin className="w-4 h-4" />
          View Location
        </button>

      </motion.div>
    </section>
  );
}
