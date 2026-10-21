import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "new era store",
  description: "...",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${pixelify.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
          {children}
        <Footer />
      </body>
    </html>
  );
}
