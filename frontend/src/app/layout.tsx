import type { Metadata } from "next";
import { Inter } from "next/font/google"; // A sintaxe de importação correta
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UTFPR - Achados e Perdidos",
  description: "Sistema de achados e perdidos da UTFPR-CM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}