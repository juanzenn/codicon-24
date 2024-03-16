import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu";

const inter = Inter({ subsets: ["latin"] });

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
            <body className={inter.className}>
                <Menu />
                <main className="container">
                    {children}
                </main>
            </body>
        </html>
    );
}
