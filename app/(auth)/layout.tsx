import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import React from "react";
import '../globals.css';
import type { Metadata } from "next";

// Setting up SEO with NextJS
export const metadata: Metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application Clone'
}

const inter = Inter({ subsets: ['latin']});

export default function RootLayout(
  { children } : { children: React.ReactNode })
  {
    return (
      // Inject the ClerkProvider to the root of auth to use features provided by Clerk
      <ClerkProvider>
        <html lang="en">
          <body className={`${inter.className} bg-dark-1`}>
            <div className="w-full flex justify-center items-center min-h-screen">
            {children}
            </div>
          </body>
        </html>
      </ClerkProvider>
    )
  }