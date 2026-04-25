"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Sparkles, Crown } from "lucide-react";

export default function ThankYouSection() {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col justify-center items-center text-center overflow-hidden py-32 px-6 mt-12">
      {/* Background Image & Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/couple.png" 
          alt="Couple Silhouette" 
          fill 
          className="object-cover object-center" 
        />
        {/* A rich, warm, golden-brown gradient overlay matching the screenshot */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#804e28]/95 via-[#633b1b]/95 to-[#38200d]/95" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center w-full max-w-xl mx-auto text-white mt-10"
      >
        {/* Top Icons */}
        <div className="flex items-center gap-3 mb-12">
          <Heart className="w-6 h-6 stroke-[1.5]" />
          <Sparkles className="w-5 h-5 stroke-[1.5]" />
          <Heart className="w-6 h-6 stroke-[1.5]" />
        </div>

        {/* Main Heading */}
        <div className="relative mb-12">
          <Heart className="absolute -top-6 -left-2 sm:-left-6 w-4 h-4 text-white/50 stroke-[1.5]" />
          <h2 className="text-5xl sm:text-6xl font-serif text-white/95 leading-[1.2] tracking-wide">
            We Can't Wait<br />to Celebrate<br />with You!
          </h2>
        </div>

        {/* Subtext */}
        <p className="text-lg sm:text-xl font-sans font-light tracking-wide leading-relaxed text-white/90 px-2 sm:px-6">
          Thank you for being part of our love story. Your presence will make our wedding day absolutely perfect.
        </p>

        {/* Floating Crown Icon at Bottom Right */}
        <div className="absolute -bottom-24 right-4 sm:right-10 hidden sm:block">
           <Crown className="w-5 h-5 text-white/30 stroke-[1.5]" />
        </div>
      </motion.div>
      
      {/* Silhouette styling hint (simulated on mobile if the photo doesn't have one natively) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#2a1708] to-transparent z-0" />
    </section>
  );
}
