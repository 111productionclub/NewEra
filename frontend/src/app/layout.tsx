import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "new era store",
  description: "...",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Header />
          {children}
        <Footer />
      </body>
    </html>
  );
}
