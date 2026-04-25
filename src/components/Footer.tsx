"use client";

import { Heart, Sparkles, Crown } from "lucide-react";
import { WEDDING_DATE_DISPLAY, VENUE_NAME, VENUE_HALL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="w-full bg-sand-light py-16 px-8 relative overflow-hidden z-10 w-full sm:rounded-t-[40px] -mt-8 border-t border-charcoal/5">
      
      {/* Subtle Background Elements */}
      <Heart className="absolute top-12 left-10 w-4 h-4 text-charcoal/5 opacity-40" />
      <Sparkles className="absolute top-24 right-1/4 w-4 h-4 text-charcoal/5 opacity-40" />
      <Crown className="absolute bottom-32 right-12 w-5 h-5 text-charcoal/5 opacity-40" />

      <div className="max-w-4xl mx-auto flex flex-col relative z-10 font-sans tracking-wide">
        
        <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-24 mb-6 px-4 sm:px-12 md:px-0">
          {/* Wedding Details Section */}
          <div className="flex-1">
            <h3 className="font-serif text-xl text-charcoal mb-4">Wedding Details</h3>
            <div className="space-y-3 text-sm text-charcoal/80 font-light">
              <p>{WEDDING_DATE_DISPLAY}</p>
              <p>{VENUE_NAME}</p>
              <p className="font-medium text-charcoal">{VENUE_HALL}</p>
              <p className="text-gold font-medium pt-2">#Dil&MadhushaWedding</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex-1">
            <h3 className="font-serif text-xl text-charcoal mb-4">Contact</h3>
            <div className="space-y-4 text-sm text-charcoal/80 font-light">
              <p>Weddings by Thamara - 077 089 9227</p>
              <p>Madhusha - 077 179 0391</p>
              <p>Dilhani - 077 328 9013</p>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="h-px w-full bg-charcoal/10 mt-4 mb-2" />

        {/* Closing details */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2 text-sm text-charcoal/60 font-serif">
            <Heart className="w-4 h-4 text-gold" />
            <span>Made with love</span>
            <Heart className="w-4 h-4 text-gold" />
          </div>

          <p className="text-[11px] text-charcoal/40 tracking-wider">
            &copy; {new Date().getFullYear()} Dilhani & Madhusha's Wedding
          </p>

        
        </div>

      </div>
    </footer>
  );
}
