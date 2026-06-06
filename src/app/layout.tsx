import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Remove dark class from HTML element
                document.documentElement.classList.remove('dark');
                // Set the theme to light in localStorage
                localStorage.setItem('adcentral-theme', 'light');
                // Clear old theme key
                localStorage.removeItem('theme');
              } catch (e) {
                // Ignore errors
              }
            })();
          `,
        }}
      />
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground dark:bg-zinc-950 dark:text-zinc-100"
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
