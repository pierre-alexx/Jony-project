import type { Metadata } from "next";
import "../app/globals.css";

export const metadata: Metadata = {
  title: "Jony - The first AI agent with taste",
  description: "Design quality UI from a prompt. Jony turns your idea into beautiful, production-ready UI.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
