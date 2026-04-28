"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Set cookie manually for middleware to read
        document.cookie = `admin_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        router.push("/admin");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Connection failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] rounded-full bg-gold blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-navy blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h2 className="text-5xl font-script text-gold mb-2">Subhash & Oshani</h2>
          <p className="text-charcoal/40 uppercase tracking-[0.3em] text-[10px] font-bold">Admin Portal Login</p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] shadow-2xl shadow-charcoal/5 relative overflow-hidden group">
          {/* Subtle floral pattern overlay would go here if available */}
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[11px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold transition-transform group-focus-within:scale-110">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/50 border border-charcoal/5 focus:border-gold/30 focus:ring-4 focus:ring-gold/5 rounded-2xl py-4 pl-12 pr-4 text-charcoal outline-none transition-all placeholder:text-charcoal/20"
                  placeholder="Enter administrator ID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-charcoal/40 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold transition-transform group-focus-within:scale-110">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 border border-charcoal/5 focus:border-gold/30 focus:ring-4 focus:ring-gold/5 rounded-2xl py-4 pl-12 pr-4 text-charcoal outline-none transition-all placeholder:text-charcoal/20"
                  placeholder="Enter secure password"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm border border-red-500/20"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light disabled:bg-gold/50 text-white font-bold py-5 rounded-2xl shadow-lg shadow-gold/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-8 border-t border-charcoal/5">
             <p className="text-[10px] text-charcoal/30 font-bold uppercase tracking-widest leading-loose">
               Confidential Access Only<br/>
               © 2027 Wedding Administration
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
