import type { Metadata } from "next";
import { Cormorant_Garamond, Dancing_Script, Caveat, DM_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import AudioManager from "@/components/AudioManager";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant-var",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dancing-var",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat-var",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "For Misri 🤍",
  description: "Something special, just for you panda.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dancing.variable} ${caveat.variable} ${dmSans.variable}`}>
      <body className="bg-background text-cream antialiased overflow-hidden w-screen h-screen">
        <CustomCursor />
        <AudioManager />
        {children}
      </body>
    </html>
  );
}
