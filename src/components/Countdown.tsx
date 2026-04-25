"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <section className="w-full bg-sand-light py-20 px-4 flex flex-col items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="text-center max-w-lg w-full"
      >
        <h2 className="text-4xl sm:text-5xl font-serif text-charcoal mb-6">
          Counting Down to Forever
        </h2>

        <div className="flex items-center justify-center gap-3 text-charcoal/60 mb-12">
          <Heart className="w-4 h-4 fill-charcoal/10" />
          <span className="font-sans text-sm tracking-widest uppercase">
            Our special day is almost here
          </span>
          <Heart className="w-4 h-4 fill-charcoal/10" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <motion.div
              key={unit}
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-charcoal/5 flex flex-col items-center justify-center"
            >
              <span className="text-4xl sm:text-5xl font-sans font-light text-charcoal mb-2">
                {value}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/40 font-bold">
                {unit}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
