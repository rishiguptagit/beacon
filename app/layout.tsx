import { Metadata } from "next";
import { geistSans, geistMono } from "./fonts";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beacon.AI",
  description: "Beacon.AI is a platform for real-time emergency management and disaster response.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
