"use client";

import { motion } from "framer-motion";
import { Scroll, MapPin } from "lucide-react";
import { WEDDING_DATE_DISPLAY, VENUE_NAME } from "@/lib/constants";

export default function EventCards({
  onLocationClick
}: {
  onLocationClick?: () => void;
}) {
  return (
    <section className="w-full bg-white pb-24 px-4 flex flex-col items-center relative z-10">
      
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
        <div className="w-16 h-16 rounded-full bg-[#b89e95] flex items-center justify-center text-white mb-8 shadow-inner">
          <Scroll className="w-8 h-8 stroke-[1.5]" />
        </div>

        <h3 className="text-[28px] sm:text-3xl font-serif text-charcoal mb-5">
          Poruwa Ceremony
        </h3>
        
        <div className="space-y-3 mb-8">
          <p className="text-charcoal/80 font-sans sm:text-lg">
            {WEDDING_DATE_DISPLAY}
          </p>
          <p className="text-charcoal/60 font-sans text-sm sm:text-base">
            10:00 AM onwards
          </p>
          <p className="text-charcoal/80 font-sans font-medium pt-2">
            {VENUE_NAME}
          </p>
          <p className="text-charcoal/60 font-sans text-sm pb-1">
            Tunapaha
          </p>
          <p className="text-charcoal/50 font-serif italic text-sm pt-2 leading-relaxed max-w-[280px]">
            If you need any further information, please don't hesitate to reach out to us
          </p>
        </div>

        <button 
          onClick={onLocationClick}
          className="w-full bg-gold text-white py-4 rounded-full font-bold uppercase tracking-[0.15em] text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md hover:bg-gold-light active:scale-[0.98] transition-all"
        >
          <MapPin className="w-4 h-4" />
          View Location
        </button>

      </motion.div>
    </section>
  );
}
