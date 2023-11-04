import QueryProvider from "@/components/QueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "AI Ebook Generator",
  description:
    "Create engaging ebooks effortlessly with our AI-powered Ebook Generator. Generate custom content and organize chapters. Save time and resources by seamlessly converting diverse topics into professionally formatted ebooks in various formats. Elevate your content creation with ease, efficiency, and creativity.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
