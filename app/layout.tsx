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
      </body>
    </html>
  );
} 