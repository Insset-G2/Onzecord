"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/components/ContextProvider";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html lang="en">
        <ContextProvider>
            <body className={ `${ inter.className } dark bg-neutral-900 text-neutral-100 h-screen overflow-hidden` }>
                { children }
                <Toaster />
            </body>
        </ContextProvider>
    </html>
  );
}

