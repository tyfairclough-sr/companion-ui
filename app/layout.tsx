import type { Metadata } from "next";
import "./globals.css";
import "./winston.css";

export const metadata: Metadata = {
  title: "Avatar Slide Animations",
  description: "Winston companion animation prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
