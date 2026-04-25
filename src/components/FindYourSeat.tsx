"use client";

import { motion } from "framer-motion";
import { VENUE_HOTEL, VENUE_HALL } from "@/lib/constants";
import { UtensilsCrossed } from "lucide-react";

type GuestSeatInfo = {
  table?: string;
  seat?: string;
};

export default function FindYourSeat({ guest }: { guest: GuestSeatInfo }) {
  // If we don't have seating information, we shouldn't render the direct assignment
  // Or we render a fallback. For now, let's render what we have.
  const hasSeatInfo = guest.table && guest.seat;

  return (
    <section className="w-full bg-sand-light py-20 px-4 flex flex-col items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-lg w-full flex flex-col items-center"
      >
        {/* Circular Icon */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-8 border border-charcoal/5">
          <UtensilsCrossed className="w-8 h-8 text-charcoal/80 stroke-1" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-4xl sm:text-5xl font-serif text-charcoal mb-4">
          Find Your Seat
        </h2>
        <p className="text-sm font-sans tracking-widest text-charcoal/60 uppercase mb-8">
          We've saved a special spot just for you
        </p>

        {/* Seat Assignment Pill */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-full px-8 py-4 shadow-sm border border-charcoal/5 flex items-center gap-6 mb-8"
        >
          {hasSeatInfo ? (
            <>
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-[0.2em] text-charcoal/40 font-bold mb-1">Table</span>
                <span className="text-2xl font-serif text-charcoal">{guest.table}</span>
              </div>
              
              <div className="w-px h-10 bg-charcoal/10" />
              
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-[0.2em] text-charcoal/40 font-bold mb-1">Seat</span>
                <span className="text-2xl font-serif text-charcoal">{guest.seat}</span>
              </div>
            </>
          ) : (
            <div className="text-charcoal/50 font-serif italic text-lg py-2">
              Seating will be assigned soon.
            </div>
          )}
        </motion.div>

        {/* Hotel and Hall Details */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-2 items-center"
        >
          <div className="flex items-center gap-4 text-charcoal/60">
            <span className="text-lg font-serif">{VENUE_HOTEL}</span>
            <div className="w-1 h-1 rounded-full bg-charcoal/20" />
            <span className="text-lg font-serif">{VENUE_HALL}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
