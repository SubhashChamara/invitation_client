"use client";

import { motion } from "framer-motion";
import {
  BRIDE_FULL_NAME,
  GROOM_FULL_NAME,
  BRIDE_ROLE,
  BRIDE_PARENTS,
  GROOM_ROLE,
  GROOM_PARENTS
} from "@/lib/constants";

export default function HappyCouple({ eventType }: { eventType?: string }) {
  const floatVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className="w-full bg-white py-24 px-4 flex flex-col items-center text-center relative z-10">

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={floatVariants}
        className="max-w-xl mx-auto flex flex-col items-center mb-16"
      >
        <h2 className="text-5xl sm:text-6xl font-serif text-charcoal mb-4">
          The Happy<br />Couple
        </h2>

        {/* Soft elegant divider */}
        <div className="h-px w-24 bg-charcoal/20 my-4" />

        <p className="text-charcoal/70 leading-relaxed font-serif text-sm sm:text-base mt-2 px-4 max-w-sm">
          Two hearts, one love story. Meet the bride and groom who are about to begin their forever journey.
        </p>
      </motion.div>

      {/* Profiles Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-32 max-w-5xl w-full">
        {eventType === "homecoming" ? (
          <>
            {/* Groom Profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-3xl sm:text-4xl font-serif text-charcoal">{GROOM_FULL_NAME}</h3>

              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-charcoal/70 font-serif text-[17px]">{GROOM_ROLE}</p>
                <p className="text-charcoal/60 font-serif text-sm">{GROOM_PARENTS}</p>
              </div>
            </motion.div>

            {/* Bride Profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center mt-12 md:mt-0"
            >
              <h3 className="text-3xl sm:text-4xl font-serif text-charcoal">{BRIDE_FULL_NAME}</h3>

              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-charcoal/70 font-serif text-[17px]">{BRIDE_ROLE}</p>
                <p className="text-charcoal/60 font-serif text-sm">{BRIDE_PARENTS}</p>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Bride Profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-3xl sm:text-4xl font-serif text-charcoal">{BRIDE_FULL_NAME}</h3>

              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-charcoal/70 font-serif text-[17px]">{BRIDE_ROLE}</p>
                <p className="text-charcoal/60 font-serif text-sm">{BRIDE_PARENTS}</p>
              </div>
            </motion.div>

            {/* Groom Profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center mt-12 md:mt-0"
            >
              <h3 className="text-3xl sm:text-4xl font-serif text-charcoal">{GROOM_FULL_NAME}</h3>

              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-charcoal/70 font-serif text-[17px]">{GROOM_ROLE}</p>
                <p className="text-charcoal/60 font-serif text-sm">{GROOM_PARENTS}</p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
