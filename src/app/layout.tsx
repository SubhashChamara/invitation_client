import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "A Night to Remember | Wedding Invitation",
  description: "Join us for an elegant celebration of love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cormorant.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-sand text-charcoal selection:bg-gold selection:text-navy">
        {children}
      </body>
    </html>
  );
}
