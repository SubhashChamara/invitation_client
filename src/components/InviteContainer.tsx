"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import CoverPage from "./CoverPage";
import FloatingElements from "./FloatingElements";
import InviteCard from "./InviteCard";
import RSVPForm from "./RSVPForm";

import HeroSection from "./HeroSection";
import Countdown from "./Countdown";
import FindYourSeat from "./FindYourSeat";
import HappyCouple from "./HappyCouple";
import CoupleNote from "./CoupleNote";
import WeddingDetailsHeader from "./WeddingDetailsHeader";
import EventCards from "./EventCards";
import WeddingTimeline from "./WeddingTimeline";
import ThankYouSection from "./ThankYouSection";
import Footer from "./Footer";
import { WEDDING_DATE_ISO } from "@/lib/constants";

type Guest = {
  id: string;
  name: string;
  personalized_message: string;
  table?: string;
  seat?: string;
  rsvpStatus?: string;
  guestCount?: number;
  rsvpMessage?: string;
};

export default function InviteContainer({ guestSlug }: { guestSlug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuest = async () => {
      setLoading(true);
      
      // Let's make "demo" a special slug that always works locally
      if (guestSlug === "demo") {
        setGuest({
          id: "00000000-0000-0000-0000-000000000000",
          name: "Honored Guest",
          personalized_message: "We would be absolutely thrilled to have you celebrate this magical night with us.",
          table: "Table 4",
          seat: "Seat 12A",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8585/api/invitations/${guestSlug}`);
        if (response.ok) {
          const data = await response.json();
          setGuest({
            id: data.id,
            name: data.name,
            personalized_message: "We would love for you to join us on our special day.",
            table: data.tableName,
            seat: data.sheetDetail,
            rsvpStatus: data.rsvpStatus,
            guestCount: data.guestCount,
            rsvpMessage: data.rsvpMessage,
          });
        }
 else {
          // Fallback if not found in backend
          const formattedSlugName = decodeURIComponent(guestSlug)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guestSlug);
          
          setGuest({
            id: "unknown",
            name: isUUID ? "Honored Guest" : formattedSlugName,
            personalized_message: "We would love for you to join us on our special day.",
            table: "Unassigned",
            seat: "Unassigned",
          });
        }
      } catch (error) {
        console.error("Client-side fetch failed:", error);
        // Fallback on error
        setGuest({
          id: "error",
          name: "Honored Guest",
          personalized_message: "We would love for you to join us on our special day.",
          table: "Unassigned",
          seat: "Unassigned",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [guestSlug]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sand-light">
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
          />
        )}
      </AnimatePresence>

      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative min-h-screen bg-white flex flex-col items-center"
        style={{ height: isOpen ? 'auto' : '100vh', overflow: isOpen ? 'visible' : 'hidden' }}
      >
        <FloatingElements />
        
        {/* Full Screen Cinematic Hero Section */}
        <section className="w-full relative z-20">
          <HeroSection 
             isActive={isOpen}
          />
        </section>

        {/* Countdown Section - First thing after Hero */}
        <Countdown targetDate={WEDDING_DATE_ISO} />

        {/* Find Your Seat Section */}
        <FindYourSeat guest={guest} />

        {/* The Happy Couple Section */}
        <HappyCouple />

        {/* Note from the Couple */}
        <div className="w-full bg-white flex justify-center pb-20">
          <CoupleNote />
        </div>

        {/* Wedding Details Header */}
        <WeddingDetailsHeader />

        {/* Event Specific Cards (e.g., Poruwa) */}
        <EventCards onLocationClick={() => window.open('https://maps.google.com/?q=6.9016,79.9099')} />
        
        {/* Wedding Timeline */}
        <WeddingTimeline />

        {/* RSVP Section */}
        <RSVPForm 
          guestId={guest.id} 
          guestName={guest.name}
          initialStatus={guest.rsvpStatus}
          initialGuestCount={guest.guestCount}
          initialMessage={guest.rsvpMessage}
        />

        {/* Final Thank You / Grand Finale Section */}
        <ThankYouSection />

        {/* Updated Details and Contact Footer */}
        <Footer />

      </motion.main>

    </>
  );
}
