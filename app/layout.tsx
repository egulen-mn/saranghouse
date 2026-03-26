import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sarang House — 사랑 · Cuisine Coréenne & Japonaise · Toulouse",
  description: "Sarang House, 사랑 — l'amour dans chaque assiette. Restaurant coréen et japonais au cœur de Toulouse. Bibimbap, ramen, sushi, gyoza faits maison. 25 rue du Taur.",
  keywords: ["restaurant coréen toulouse", "restaurant japonais toulouse", "bibimbap toulouse", "ramen toulouse", "sushi toulouse", "sarang house"],
  openGraph: {
    title: "Sarang House — 사랑",
    description: "Cuisine coréenne & japonaise au cœur de Toulouse. L'amour dans chaque assiette.",
    url: "https://saranghouse.tengerly.com",
    siteName: "Sarang House",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Noto+Sans+KR:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
