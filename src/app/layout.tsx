import type { Metadata } from "next";
import { Geist, Geist_Mono, Limelight, Noto_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const limelight = Limelight({
  variable: "--font-limelight",
  subsets: ["latin"],
  weight: "400",
});

const notoSans = Noto_Sans({
  variable: "--font-faculty-glyphic",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "The End Page Museum",
  description: "An Adventure Down Memory Lane",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${limelight.variable} ${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
