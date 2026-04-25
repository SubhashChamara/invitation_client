"use client";

import { motion } from "framer-motion";

export default function FloatingElements() {
  const elements = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    size: Math.random() * 10 + 5,
    isPetal: Math.random() > 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute ${
            el.isPetal ? "bg-white/20 rounded-full blur-[1px]" : "bg-gold/30 rotate-45 h-1 w-8"
          }`}
          style={{
            left: el.left,
            top: el.top,
            width: el.isPetal ? el.size : undefined,
            height: el.isPetal ? el.size : undefined,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
