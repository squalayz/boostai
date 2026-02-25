import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boost AI - The First Token Humans Can't Buy",
  description: "Choose your AI creature. Deploy on Base. It trades $BOOST autonomously.",
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
      </body>
    </html>
  );
}
