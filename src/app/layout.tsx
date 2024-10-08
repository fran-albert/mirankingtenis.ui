import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import SessionAuthProvider from "@/context/SessionAuthProviders";
import { ProfilePhotoProvider } from "@/context/ProfilePhotoContext";
import MainContainer from "./mainContainer";
import ClientWrapper from "@/components/Client/Wrapper";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "Mi Ranking Tenis - %s",
    default: "Mi Ranking Tenis",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link
        type="image/png"
        sizes="16x16"
        rel="icon"
        href="https://mirankingtenis.com.ar/wp-content/uploads/2023/05/cropped-cropped-LOGOTENIS-171x172.png"
      />
      <body
        className={cn(
          "min-h-screen bg-gray-50 font-sans antialiased",
          roboto.className
        )}
      >
        <ProfilePhotoProvider>
          <SessionAuthProvider>
            <Toaster richColors position="top-center" />
            <MainContainer>

              <ClientWrapper>
                {children}
              </ClientWrapper>
            </MainContainer>
          </SessionAuthProvider>
        </ProfilePhotoProvider>
      </body>
    </html>
  );
}
