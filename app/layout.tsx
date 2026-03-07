import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Room Designer Prototype",
  description: "Next.js + Three.js prototype for 2D layout and 3D preview.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
