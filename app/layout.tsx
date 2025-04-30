import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "AI Page Summarizer - Расширение Chrome для создания саммари страниц",
  description: "Расширение Chrome для создания кратких содержаний веб-страниц с использованием AI (OpenRouter API).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <main>{children}</main>
        <footer className="w-full border-t mt-12 py-4 bg-white text-center text-sm text-gray-500 flex flex-col md:flex-row items-center justify-center gap-4">
          <nav className="flex flex-wrap gap-4 justify-center">
            <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
            <a href="/support" className="hover:underline">Support</a>
            <a href="/refund" className="hover:underline">Refund Policy</a>
          </nav>
          <span className="block mt-2 md:mt-0">&copy; {new Date().getFullYear()} summary-page.online</span>
        </footer>
      </body>
    </html>
  );
}