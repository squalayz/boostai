import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Boost AI - The First Token Humans Can't Buy",
  description: "Choose your AI creature. Deploy on Base. It trades $BOOST autonomously. Humans don't touch. AI trades for you.",
  metadataBase: new URL("https://aiboostcoin.com"),
  openGraph: {
    title: "Boost AI - The First Token Humans Can't Buy",
    description: "Choose your AI creature. Deploy on Base. It trades $BOOST autonomously.",
    url: "https://aiboostcoin.com",
    siteName: "Boost AI",
    images: [{ url: "/og-image.png", width: 1536, height: 1024, alt: "Boost AI - AI Trading Robot" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boost AI - The First Token Humans Can't Buy",
    description: "Choose your AI creature. Deploy on Base. It trades $BOOST autonomously.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#030210" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
