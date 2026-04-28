"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ImageOff } from "lucide-react";
import {
  BRIDE_NAME,
  GROOM_NAME,
  WEDDING_DATE_ISO,
  VENUE_HOTEL,
} from "@/lib/constants";

function formatShortDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function ThankYouPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const shortDate = formatShortDate(WEDDING_DATE_ISO);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/thanks-image", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.blob();
      })
      .then((blob) => {
        setImageSrc(URL.createObjectURL(blob));
        setImageLoading(false);
      })
      .catch(() => {
        setImageError(true);
        setImageLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    /*
     * Outer wrapper:
     *  - Mobile  → full viewport, no padding, bg matches card (white)
     *  - sm+     → centered stage with soft bg and generous padding
     */
    <div className="min-h-screen w-full bg-white sm:bg-[#f7f4ef] flex items-start sm:items-center justify-center sm:p-8 lg:p-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        /*
         * Card:
         *  - Mobile  → full width, full min-height, no rounded corners, no shadow
         *  - sm+     → max-width constrained, rounded none (reference card is rectangular),
         *              elevated shadow
         */
        className="
          w-full min-h-screen flex flex-col bg-white
          sm:min-h-0 sm:w-auto sm:max-w-[480px] md:max-w-[520px]
          sm:shadow-[0_12px_64px_rgba(0,0,0,0.15)]
        "
      >
        {/* ── TOP HEADER ── */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6 sm:pt-7 sm:pb-5">
          {/* Top rule */}
          <div className="w-full flex items-center gap-3 mb-4">
            <div className="flex-1 h-[1px] bg-[#c5a059]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]/60" />
            <div className="flex-1 h-[1px] bg-[#c5a059]/40" />
          </div>

          <h1 className="text-[13px] sm:text-[13px] font-sans font-bold tracking-[0.55em] text-[#2c2c2c] uppercase mb-1">
            Thank You
          </h1>
          <p className="text-[9px] sm:text-[9px] font-sans font-medium tracking-[0.45em] text-[#c5a059] uppercase">
            Our Wedding Day
          </p>

          {/* Thank you message */}
          <p className="font-serif text-[12px] sm:text-[13px] italic text-[#2c2c2c]/55 mt-3 px-2 sm:px-4 text-center leading-relaxed tracking-wide max-w-xs">
            We are deeply grateful for your love, blessings, and
            presence that made our special day truly unforgettable.
          </p>

          {/* Bottom rule */}
          <div className="w-full flex items-center gap-3 mt-4">
            <div className="flex-1 h-[1px] bg-[#c5a059]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]/60" />
            <div className="flex-1 h-[1px] bg-[#c5a059]/40" />
          </div>
        </div>

        {/* ── PHOTO SECTION ──
            Mobile  → flex-1 so it fills remaining screen height
            sm+     → fixed aspect ratio (3/4 portrait)  */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="relative w-full flex-1 sm:flex-none bg-[#e8e1d5]"
          style={{ aspectRatio: "unset" }}
        >
          {/* On sm+ apply the portrait ratio via a pseudo-height trick */}
          <style>{`
            @media (min-width: 640px) {
              .photo-frame { aspect-ratio: 3/4; }
            }
            @media (max-width: 639px) {
              .photo-frame { min-height: 60vh; }
            }
          `}</style>
          <div className="photo-frame relative w-full h-full min-h-[60vh] sm:min-h-0 bg-[#e8e1d5]">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f0ece4]">
                <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
              </div>
            )}

            {!imageLoading && imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f0ece4] text-[#2c2c2c]/40">
                <ImageOff className="w-10 h-10" />
                <p className="text-xs font-sans tracking-widest uppercase">No image found</p>
                <p className="text-[10px] font-sans opacity-60 px-8 text-center">
                  Place an image in<br />
                  <span className="font-medium text-[#c5a059]">
                    Archive\invitation\thanks
                  </span>
                </p>
              </div>
            )}

            {!imageLoading && imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="Wedding Couple"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            )}
          </div>
        </motion.div>

        {/* ── BOTTOM FOOTER ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="px-5 sm:px-6 pt-4 sm:pt-5 pb-6 sm:pb-6 flex flex-col items-center gap-3"
        >
          {/* Three-column info row */}
          <div className="w-full grid grid-cols-3 items-center gap-1">

            {/* Date — left */}
            <div className="flex flex-col items-start">
              
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.12em] text-[#2c2c2c] uppercase">
                {shortDate}
              </span>
            </div>

            {/* Couple Names — centre */}
            <div className="flex flex-col items-center">
              <div className="w-[1px] h-3 bg-[#c5a059]/40 mb-2" />
              <p className="font-script text-[24px] sm:text-[28px] text-[#2c2c2c] leading-none text-center">
                {BRIDE_NAME}
              </p>
              <p className="text-[7px] font-sans tracking-[0.35em] text-[#c5a059] uppercase my-1">
                &amp;
              </p>
              <p className="font-script text-[24px] sm:text-[28px] text-[#2c2c2c] leading-none text-center">
                {GROOM_NAME}
              </p>
              <div className="w-[1px] h-3 bg-[#c5a059]/40 mt-2" />
            </div>

            {/* Venue — right */}
            <div className="flex flex-col items-end text-right">
              
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.08em] text-[#2c2c2c] uppercase leading-snug">
                {VENUE_HOTEL}
              </span>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
