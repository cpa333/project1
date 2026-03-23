import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "DailyEng - Daily Interactive English Newsletter",
  description: "Read English news, translate, and learn new vocabulary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-y-scroll overflow-x-hidden`}>
        <Navbar />
        <main className="flex-1 flex flex-col justify-start items-center w-full p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
