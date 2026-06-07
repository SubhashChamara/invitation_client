"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import CoverPage from "./CoverPage";
import FloatingElements from "./FloatingElements";
import HeroSection from "./HeroSection";
import Countdown from "./Countdown";
import FindYourSeat from "./FindYourSeat";
import HappyCouple from "./HappyCouple";
import CoupleNote from "./CoupleNote";
import WeddingDetailsHeader from "./WeddingDetailsHeader";
import EventCards from "./EventCards";
import HomecomingTimeline from "./HomecomingTimeline";
import ThankYouSection from "./ThankYouSection";
import Footer from "./Footer";
import RSVPForm from "./RSVPForm";
import { 
  HOMECOMING_DATE_ISO, 
  HOMECOMING_DATE_DISPLAY, 
  BRIDE_NAME, 
  GROOM_NAME, 
  API_BASE_URL 
} from "@/lib/constants";

type Guest = {
  id: string;
  name: string;
  personalized_message: string;
  table?: string;
  seat?: string;
  rsvpStatus?: string;
  guestCount?: number;
  rsvpMessage?: string;
  eventType?: string;
};

export default function HomecomingInviteContainer({ guestSlug }: { guestSlug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuest = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/invitations/${guestSlug}`);
        if (response.ok) {
          const data = await response.json();
          setGuest({
            id: data.id,
            name: data.name,
            personalized_message: "We would love for you to join us on our homecoming celebration.",
            table: data.tableName,
            seat: data.sheetDetail,
            rsvpStatus: data.rsvpStatus,
            guestCount: data.guestCount,
            rsvpMessage: data.rsvpMessage,
            eventType: data.eventType || "homecoming",
          });
        } else {
          // Fallback
          setGuest({
            id: "unknown",
            name: "Honored Guest",
            personalized_message: "We would love for you to join us on our homecoming celebration.",
            table: "Unassigned",
            seat: "Unassigned",
            eventType: "homecoming"
          });
        }
      } catch (error) {
        console.error("Client-side fetch failed:", error);
        setGuest({
          id: "error",
          name: "Honored Guest",
          personalized_message: "We would love for you to join us on our homecoming celebration.",
          table: "Unassigned",
          seat: "Unassigned",
          eventType: "homecoming"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [guestSlug]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-red-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 className="w-10 h-10 text-gold" />
        </motion.div>
        <p className="text-charcoal/60 font-serif italic tracking-widest text-sm">Preparing your invitation...</p>
      </div>
    );
  }

  if (!guest) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <CoverPage 
            guestName={guest.name} 
            onOpen={() => setIsOpen(true)} 
            eventType="homecoming"
          />
        )}
      </AnimatePresence>

      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative min-h-screen bg-[#faf9f6] flex flex-col items-center"
        style={{ height: isOpen ? 'auto' : '100vh', overflow: isOpen ? 'visible' : 'hidden' }}
      >
        <FloatingElements eventType="homecoming" />
        
        <section className="w-full relative z-20">
          <HeroSection 
             isActive={isOpen}
             weddingDate={HOMECOMING_DATE_DISPLAY}
             brideName={BRIDE_NAME}
             groomName={GROOM_NAME}
             eventType="homecoming"
          />
        </section>

        <Countdown targetDate={HOMECOMING_DATE_ISO} eventType="homecoming" />

        <FindYourSeat guest={guest} eventType="homecoming" />

        <HappyCouple eventType="homecoming" />

        <div className="w-full bg-[#faf9f6] flex justify-center pb-20">
          <CoupleNote eventType="homecoming" />
        </div>

        <WeddingDetailsHeader eventType="homecoming" />

        <EventCards 
          onLocationClick={() => window.open('https://www.google.com/maps/place/Hotel+Grand+Manali/@6.0597098,80.8298222,54m/data=!3m1!1e3!4m12!1m5!3m4!2zNsKwMDMnMzUuNyJOIDgwwrA0OSc0OC41IkU!8m2!3d6.05991!4d80.83013!3m5!1s0x3ae6b5004e1f9183:0x4982a4911c310cb!8m2!3d6.059745!4d80.8300226!16s%2Fg%2F11xclz45cr?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D')} 
          eventType="homecoming"
        />
        
        <HomecomingTimeline />

        <RSVPForm 
          guestId={guest.id} 
          guestName={guest.name}
          initialStatus={guest.rsvpStatus}
          initialGuestCount={guest.guestCount}
          initialMessage={guest.rsvpMessage}
          eventType="homecoming"
        />

        <ThankYouSection eventType="homecoming" />

        <Footer eventType="homecoming" />

      </motion.main>
    </>
  );
}
