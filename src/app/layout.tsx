import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "Markachew - Find Your Dream Home & Perfect Job",
  description: "Connect with opportunities that matter. Whether you're looking for your next home or your next career move, we've got you covered with AI-powered matching and personalized recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

