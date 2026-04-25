import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Edit2, CheckCircle2 } from "lucide-react";

export default function RSVPForm({ 
  guestId, 
  guestName,
  initialStatus,
  initialGuestCount,
  initialMessage
}: { 
  guestId: string;
  guestName: string;
  initialStatus?: string;
  initialGuestCount?: number;
  initialMessage?: string;
}) {
  const [status, setStatus] = useState<"attending" | "declined" | null>(null);
  const [guestsCount, setGuestsCount] = useState(1);
  const [foodPreference, setFoodPreference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Synchronize state with props when they change (initial load)
  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus as "attending" | "declined");
      setGuestsCount(initialGuestCount || 1);
      setFoodPreference(initialMessage || "");
      // If we have an initial status and haven't just successfully submitted, show view mode
      if (!isSuccess) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  }, [initialStatus, initialGuestCount, initialMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8585/api/invitations/${guestId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          guestCount: status === "attending" ? guestsCount : 0,
          message: foodPreference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit RSVP. Please try again later.");
      }

      setIsSuccess(true);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to submit RSVP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasRsvpAlready = !!initialStatus && !isEditing;

  return (
    <section className="w-full bg-white pt-12 pb-24 px-4 flex flex-col items-center relative z-10">
      
      {/* Header and Intro */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto flex flex-col items-center text-center mt-4"
      >
        <div className="relative flex items-center justify-center w-full mb-4">
          <Heart className="absolute left-[20%] w-4 h-4 text-charcoal/10" strokeWidth={1.5} />
          <h2 className="text-4xl sm:text-5xl font-serif text-charcoal">
            RSVP
          </h2>
        </div>
        
        <div className="h-px w-24 bg-charcoal/20 my-4" />
        
        <p className="text-charcoal/70 leading-relaxed font-sans text-[15px] sm:text-[17px] mt-4 px-2 tracking-wide font-light">
          We can't wait to celebrate with you! Please let us know if you'll be joining us on our special day.
        </p>
      </motion.div>

      {/* Main Content Layout Container */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full max-w-6xl gap-12 lg:gap-24 mt-12 w-full">
        
        {/* Left Column: Image and Save the Date */}
        <div className="flex flex-col items-center w-full lg:w-1/2 max-w-sm">
          {/* Large Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden border border-charcoal/5 shadow-sm"
          >
            <Image 
              src="/couple.png" 
              alt="Happy Couple RSVP" 
              fill 
              className="object-cover object-top"
            />
            {/* Floating music badge */}
            <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white shadow-lg">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
          </motion.div>

          {/* Save the Date Card overlapping the image slightly */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-full bg-white rounded-[24px] shadow-lg border border-charcoal/5 p-6 sm:p-8 -mt-20 z-20"
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <Heart className="w-5 h-5 text-charcoal stroke-[2]" />
              <h3 className="font-serif text-lg font-bold text-charcoal">Save the Date!</h3>
            </div>
            <p className="text-charcoal/70 text-sm leading-relaxed font-sans text-center lg:text-left">
              Your presence will make our wedding day complete. We're so excited to celebrate this special moment with you!
            </p>
          </motion.div>
        </div>

        {/* Right Column: Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full lg:w-1/2 max-w-lg lg:mt-8"
        >
        {isSuccess ? (
          <div className="bg-sand-light p-12 rounded-[32px] text-center shadow-sm border border-charcoal/5">
            <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-6" />
            <h3 className="font-serif text-3xl text-charcoal mb-4">Thank You!</h3>
            <p className="text-charcoal/70 mb-8">Your response has been securely recorded. We look forward to seeing you.</p>
            <button 
              onClick={() => { setIsSuccess(false); setIsEditing(true); }}
              className="text-gold font-bold uppercase tracking-widest text-xs border-b border-gold pb-1 hover:text-gold-light hover:border-gold-light transition-all"
            >
              Update RSVP
            </button>
          </div>
        ) : hasRsvpAlready ? (
          <div className="bg-white p-8 sm:p-10 rounded-[32px] shadow-sm border border-charcoal/10 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${status === 'attending' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-2">You have RSVP'd</h3>
            <p className="text-charcoal/60 mb-8 italic">
              Status: <span className="font-bold text-charcoal non-italic">{status === 'attending' ? 'Attending' : 'Not Attending'}</span>
              {status === 'attending' && <>, alongside <span className="font-bold text-charcoal non-italic">{guestsCount}</span> guest(s)</>}
            </p>
            
            <button
               onClick={() => setIsEditing(true)}
               className="flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full transition-all shadow-md active:scale-[0.98] text-sm uppercase tracking-widest"
            >
               <Edit2 className="w-4 h-4" />
               Update RSVP
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#f2efe9] p-8 sm:p-10 rounded-[32px] shadow-sm border border-charcoal/5">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-sans text-charcoal/80 mb-2">Name</label>
                <input 
                  type="text" 
                  value={guestName}
                  disabled
                  placeholder="Eg: Namal Perera"
                  className="w-full bg-white border border-charcoal/5 rounded-xl px-4 py-3 sm:py-4 text-charcoal/60 shadow-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-charcoal/80 mb-2">Will you attend?</label>
                <div className="relative">
                  <select
                    value={status || ""}
                    onChange={(e) => setStatus(e.target.value as "attending" | "declined")}
                    className="w-full bg-white border border-charcoal/5 rounded-xl px-4 py-3 sm:py-4 text-charcoal/70 shadow-sm focus:outline-none appearance-none"
                  >
                    <option value="" disabled>Select</option>
                    <option value="attending">Yes, I will attend</option>
                    <option value="declined">Sorry, I cannot attend</option>
                  </select>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-charcoal/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {status === "attending" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-sans text-charcoal/80 mb-2">Number of Guests</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-white border border-charcoal/5 rounded-xl px-4 py-3 sm:py-4 text-charcoal/70 shadow-sm focus:outline-none"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-sans text-charcoal/80 mb-2">Message</label>
                <textarea 
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  placeholder="Leave a message for us..."
                  rows={3}
                  className="w-full bg-white border border-charcoal/5 rounded-xl px-4 py-3 sm:py-4 text-charcoal/70 shadow-sm focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <button
                  type="submit"
                  disabled={!status || isSubmitting}
                  className="w-full bg-gold hover:bg-gold-light text-white font-bold py-4 rounded-full transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
                >
                  {isSubmitting ? "Sending..." : initialStatus ? "Update RSVP" : "Submit"}
                </button>
                
                {initialStatus && (
                   <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full text-charcoal/40 font-bold py-2 text-xs uppercase tracking-widest hover:text-charcoal/60 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
    </section>
  );
}
