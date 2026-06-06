"use client";

import { Heart, Sparkles, Crown } from "lucide-react";
import { WEDDING_DATE_DISPLAY, VENUE_NAME, VENUE_HALL, HOMECOMING_DATE_DISPLAY, HOMECOMING_VENUE_NAME, HOMECOMING_VENUE_HALL, BRIDE_NAME, GROOM_NAME } from "@/lib/constants";

export default function Footer({ eventType }: { eventType?: string }) {
  const isHomecoming = eventType === "homecoming";
  const date = isHomecoming ? HOMECOMING_DATE_DISPLAY : WEDDING_DATE_DISPLAY;
  const venue = isHomecoming ? HOMECOMING_VENUE_NAME : VENUE_NAME;
  const hall = isHomecoming ? HOMECOMING_VENUE_HALL : VENUE_HALL;
  const title = isHomecoming ? "Homecoming Details" : "Wedding Details";
  const hashTag = isHomecoming ? `#${BRIDE_NAME}&${GROOM_NAME}Homecoming` : `#${BRIDE_NAME}&${GROOM_NAME}Wedding`;

  return (
    <footer className="w-full bg-sand-light py-16 px-8 relative overflow-hidden z-10 w-full sm:rounded-t-[40px] -mt-8 border-t border-charcoal/5">
      
      {/* Subtle Background Elements */}
      <Heart className="absolute top-12 left-10 w-4 h-4 text-charcoal/5 opacity-40" />
      <Sparkles className="absolute top-24 right-1/4 w-4 h-4 text-charcoal/5 opacity-40" />
      <Crown className="absolute bottom-32 right-12 w-5 h-5 text-charcoal/5 opacity-40" />

      <div className="max-w-4xl mx-auto flex flex-col relative z-10 font-sans tracking-wide">
        
        <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-24 mb-6 px-4 sm:px-12 md:px-0">
          {/* Details Section */}
          <div className="flex-1">
            <h3 className="font-serif text-xl text-charcoal mb-4">{title}</h3>
            <div className="space-y-3 text-sm text-charcoal/80 font-light">
              <p>{date}</p>
              <p>{venue}</p>
              <p className="font-medium text-charcoal">{hall}</p>
              <p className={`${isHomecoming ? "text-burgundy" : "text-gold"} font-medium pt-2`}>{hashTag}</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex-1">
            <h3 className="font-serif text-xl text-charcoal mb-4">Contact</h3>
            <div className="space-y-4 text-sm text-charcoal/80 font-light">
              <p>{GROOM_NAME} - 071 2900 858</p>
              <p>{BRIDE_NAME} - 077 177 3181</p>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="h-px w-full bg-charcoal/10 mt-4 mb-2" />

        {/* Closing details */}
        <div className="flex flex-col items-center text-center space-y-4">

          <p className="text-[11px] text-charcoal/40 tracking-wider">
            &copy; {new Date().getFullYear()} {BRIDE_NAME} & {GROOM_NAME}'s {isHomecoming ? 'Homecoming' : 'Wedding'}
          </p>

        
        </div>

      </div>
    </footer>
  );
}
