"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";


export default function CoupleNote() {
  return (
    <section className="w-full relative z-10 px-4 -mt-8 flex flex-col items-center">
      {/* 
        This div is the card itself. 
        It has a light sand background, rounded bottom, and a shadow.
      */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl bg-sand-light rounded-[40px] shadow-sm relative flex flex-col items-center px-6 sm:px-12 py-16 text-center"
      >
        {/* The heart icon */}
        <div className="mb-6 mt-2">
          <Heart className="w-8 h-8 text-charcoal stroke-[2]" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mb-8">
          A Note from the Couple
        </h2>
        
        <p className="text-charcoal/80 font-serif italic text-[15px] sm:text-lg leading-loose md:leading-loose">
          "Our journey together begins with a promise, and it would mean so much for us to have you there to witness it. We invite you to celebrate love, togetherness, and new beginnings as we unite in marriage. Sharing this moment with you would be an honor and if you need any information or help, we're just a call or message away."
        </p>

      </motion.div>
    </section>
  );
}
