import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

const metadataBase = new URL(
  process.env.NEXTAUTH_URL || "http://localhost:3000"
);

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
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50`}>
        {children}
      </body>
    </html>
  );
}
