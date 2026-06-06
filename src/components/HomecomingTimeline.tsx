"use client";

import { motion } from "framer-motion";
import { Diamond, Bell, Scroll, Sparkles, Utensils, Music, Car } from "lucide-react";

const timelineEvents = [
  {
    id: 1,
    time: "05.10 PM",
    description: "Welcome Reception",
    icon: Bell,
    active: true,
  },
  {
    id: 2,
    time: "05.20 PM",
    description: "Homecoming Ceremony",
    icon: Scroll,
    active: true,
  },
  {
    id: 3,
    time: "07.20 PM",
    description: "Grand Dinner",
    icon: Utensils,
    active: true,
  },
  {
    id: 4,
    time: "07.40 PM",
    description: "Music & Social Hour",
    icon: Music,
    active: true,
  },
  {
    id: 5,
    time: "10:00 PM",
    description: "Departure",
    icon: Car,
    active: true,
  }
];

export default function HomecomingTimeline() {
  return (
    <section className="w-full bg-[#faf9f6] py-24 px-4 flex flex-col items-center relative z-10">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto flex flex-col items-center text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-sans font-light tracking-wide text-charcoal mb-4">
          Homecoming<br />Timeline
        </h2>
        
        <div className="h-px w-24 bg-charcoal/20 my-6" />
      </motion.div>

      {/* Timeline Container */}
      <div className="relative mt-12 w-full max-w-lg flex flex-col items-center">
        <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-burgundy/30" />

        {timelineEvents.map((event, index) => {
          const Icon = event.icon;
          return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="relative z-10 flex flex-col items-center w-full mb-12"
            >
              <div className="w-14 h-14 rounded-full bg-burgundy flex items-center justify-center text-white border-4 border-white shadow-md mb-6 relative shadow-burgundy/10">
                <Icon className="w-6 h-6 stroke-[1.5]" />
              </div>

              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-charcoal/5 px-8 py-8 flex flex-col items-center w-[90%] lg:w-[400px] text-center z-20 hover:scale-[1.02] transition-transform duration-300">
                <h4 className="text-[22px] font-bold text-charcoal/80 mb-3 tracking-wide">
                  {event.time}
                </h4>
                <p className="text-charcoal/70 font-sans sm:text-[17px] leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
