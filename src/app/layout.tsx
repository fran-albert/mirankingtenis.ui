import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";
import SessionAuthProvider from "@/context/SessionAuthProviders";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Ranking Tenis",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-gray-50 font-sans antialiased",
          roboto.className
        )}
      >
        <SessionAuthProvider>
          <Toaster richColors position="top-center" />
          <Navbar />
          {children}
        </SessionAuthProvider>
      </body>
    </html>
  );
}
