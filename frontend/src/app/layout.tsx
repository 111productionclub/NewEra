import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SITE_URL } from "@/config/site"
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "new era store",
  description: "NewEra: одежда и аксессуары. Выбери вещь на сайте и оформи заказ в VK.",
  openGraph: {
    title: "new era store",
    description: "Одежда и аксессуары NewEra. Заказ через VK.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
      {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId="G-MR1HSJRX0P" />}
    </html>
  );
}
