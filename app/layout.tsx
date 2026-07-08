import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "SkinCare AI | Advanced Dermatological Intelligence",
  description: "Next-generation AI-powered skin analysis and clinical consultation platform for patients and specialists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} ${inter.variable} font-body antialiased bg-background text-foreground selection:bg-primary/30 selection:text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
