import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";
import { APP_TITLE, APP_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION,
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

