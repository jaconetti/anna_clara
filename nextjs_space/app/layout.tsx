import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadataBase = process.env.VERCEL_URL
  ? new URL(`https://${process.env.VERCEL_URL}`)
  : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: "Enxoval Anna Clara - Registre seu presente",
  description: "Landing page elegante para o enxoval da Anna Clara. Escolha um presente ou contribua via PIX para celebrar a chegada da bebê.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  },
  openGraph: {
    title: "Enxoval Anna Clara",
    description: "Bem-vindo ao Enxoval da Anna Clara. Escolha um presente ou contribua via PIX.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630
    }]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50`}>
        {children}
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
