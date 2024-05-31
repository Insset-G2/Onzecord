"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ContextProvider } from "@/components/ContextProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ContextProvider>
        <body className={ `${ inter.className } dark bg-neutral-900 text-neutral-100 h-screen` }>
          { children }
        </body>
      </ContextProvider>
    </html>
  );
}

