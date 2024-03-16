import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const inter = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Heritage Keeper",
  description: "Keep your memories alive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
