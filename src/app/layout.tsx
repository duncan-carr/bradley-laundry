import "~/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";

import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Bradley Laundry",
  description:
    "The unofficial laundry app for Bradley University created by Duncan Carr.",
  authors: [{ name: "Duncan Carr", url: "https://github.com/duncan-carr" }],
  keywords: ["bradley", "laundry", "bradley university", "bradley laundry"],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable}`} suppressHydrationWarning>
      <body>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
