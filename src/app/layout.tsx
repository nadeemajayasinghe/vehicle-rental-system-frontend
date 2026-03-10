import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DriveEase – Premium Car Rentals",
  description:
    "Discover your perfect drive with DriveEase. Premium car rentals with unmatched comfort, quality, and reliability.",
  keywords: "car rental, vehicle hire, DriveEase, Sri Lanka, premium cars",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <Navbar />
        <main style={{ minHeight: "100vh", paddingTop: "70px" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
