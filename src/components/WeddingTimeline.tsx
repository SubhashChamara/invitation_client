"use client";

import { motion } from "framer-motion";
import { Diamond, Bell, Scroll, Sparkles, Utensils, Music, Car } from "lucide-react";



// Helper for the timeline items to keep it clean
const timelineEvents = [
  {
    id: 1,
    time: "10.00 AM",
    description: "Groom enters the Poruwa Location",
    icon: Diamond,
    active: true,
  },
  {
    id: 2,
    time: "10.20 AM",
    description: "Bride enters the Poruwa Location",
    icon: Bell,
    active: true,
  },
  {
    id: 3,
    time: "10:31 PM",
    description: "Poruwa Ceremony",
    icon: Scroll,
    active: true,
  },
  {
    id: 4,
    time: "11:30 AM",
    description: "Couple enters the hall",
    icon: Sparkles,
    active: true,
  },
  {
    id: 5,
    time: "12:30 PM",
    description: "Lunch",
    icon: Utensils,
    active: true,
  },
  {
    id: 6,
    time: "13:45 PM",
    description: "First Dance & Dance Floor Opens",
    icon: Music,
    active: true,
  },
  {
    id: 7,
    time: "15:30 PM",
    description: "Departure",
    icon: Car,
    active: true,
  }


];

export default function WeddingTimeline() {
  return (
    <section className="w-full bg-white py-24 px-4 flex flex-col items-center relative z-10">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto flex flex-col items-center text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-sans font-light tracking-wide text-charcoal mb-4">
          Wedding Day<br />Timeline
        </h2>
        
        {/* Soft elegant divider */}
        <div className="h-px w-24 bg-charcoal/20 my-6" />
      </motion.div>

      {/* Timeline Container */}
      <div className="relative mt-12 w-full max-w-lg flex flex-col items-center">
        
        {/* The Continuous Vertical Line connecting events */}
        {/* We use a bronze/sand color exactly matching the screenshot's line */}
        <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-[2px] bg-[#9e7c65]/40" />

        {/* Render timeline events */}
        {timelineEvents.map((event, index) => {
          const Icon = event.icon;
          
          if (!event.active) {
            // Placeholder/preview for the next event in the timeline
            return (
              <div key={event.id} className="relative z-10 flex flex-col items-center w-full mt-8 opacity-40">
                <div className="w-12 h-12 rounded-full bg-[#e5e5e5] flex items-center justify-center text-charcoal/50 border-4 border-white shadow-sm mb-4">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          }

          return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="relative z-10 flex flex-col items-center w-full mb-12"
            >
              {/* Event Icon Badge */}
              <div className="w-14 h-14 rounded-full bg-[#bc9d82] flex items-center justify-center text-white border-4 border-white shadow-md mb-6 relative">
                <Icon className="w-6 h-6 stroke-[1.5]" />
              </div>

              {/* Event Card */}
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
