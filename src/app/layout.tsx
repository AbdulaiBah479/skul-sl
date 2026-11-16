import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import SwRegister from "@/components/SwRegister";

export const metadata: Metadata = {
  title: { default: "Skul SL — free learning for every student in Sierra Leone", template: "%s · Skul SL" },
  description:
    "Free, offline-friendly lessons, quizzes, exam practice, study tools and an AI tutor for Primary, JSS, SSS, technical and university students in Sierra Leone.",
  applicationName: "Skul SL",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Skul SL", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#14803c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-3">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="mx-auto max-w-3xl px-4 pb-28 pt-5 sm:pb-12">
          {children}
        </main>
        <SwRegister />
      </body>
    </html>
  );
}
