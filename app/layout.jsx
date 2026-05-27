import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata = {
  title: "northofamer — Photography & Visual Storytelling",
  description:
    "An independent photography and videography studio based in Shah Alam, crafting cinematic visuals for modern brands and the people who build them.",
  openGraph: {
    title: "northofamer — Photography & Visual Storytelling",
    description:
      "Cinematic photography and videography from Shah Alam. Editorial. Atmospheric. Considered.",
  },
};

export const viewport = {
  themeColor: "#0a0a08",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-ink-800 text-ink-0 grain antialiased">
        {children}
      </body>
    </html>
  );
}
