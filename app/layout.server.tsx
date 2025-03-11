import { geistSans, geistMono } from "./fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beacon.AI",
  description: "Beacon.AI is a platform for real-time emergency management and disaster response.",
};

export default function RootLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
