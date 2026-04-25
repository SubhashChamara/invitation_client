"use client";

import { motion } from "framer-motion";

export default function WeddingDetailsHeader() {
  return (
    <section className="w-full bg-white pt-24 pb-16 px-4 flex flex-col items-center text-center relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto flex flex-col items-center"
      >
        <h2 className="text-5xl sm:text-6xl font-sans font-light tracking-wide text-charcoal mb-4">
          Wedding<br />Details
        </h2>
        
        {/* Soft elegant divider */}
        <div className="h-px w-24 bg-charcoal/20 my-6" />
        
        <p className="text-charcoal/70 leading-relaxed font-sans text-sm sm:text-base mt-2 px-4">
          All the important information you need to celebrate our special day with us.
        </p>
      </motion.div>
    </section>
  );
}
