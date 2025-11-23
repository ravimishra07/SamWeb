import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/context/AppDataContext";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAM - Emotional Self-Tracking",
  description: "Track your mood, sleep, and chat with your AI assistant.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SAM",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-sam-dark text-sam-text-primary min-h-screen flex justify-center`}>
        <AppDataProvider>
          <div className="w-full max-w-md bg-sam-dark h-[100dvh] relative shadow-2xl overflow-hidden flex flex-col">
            {children}
            <BottomNav />
          </div>
        </AppDataProvider>
      </body>
    </html>
  );
}
