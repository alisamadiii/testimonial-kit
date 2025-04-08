import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import QueryClientProviders from "@/providers/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppWrapper from "@/components/app-wrapper";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProviders>
        <body
          className={`${geistSans.variable} ${geistMono.variable} flex bg-black antialiased`}
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="bg-background min-h-screen grow rounded-l-2xl">
              <AppWrapper>{children}</AppWrapper>
            </main>
            <Toaster />
          </SidebarProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </body>
      </QueryClientProviders>
    </html>
  );
}
