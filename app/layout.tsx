import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoTrack",
  description: "Estima tu huella de carbono diaria en lenguaje natural.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
