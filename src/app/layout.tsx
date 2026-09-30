import type { Metadata } from "next";
import { Anonymous_Pro, DM_Sans } from "next/font/google";
import { MainMenu } from "@/components/nav/MainMenu";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous-pro",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Vlad Todirut — Product Designer",
  description: "Turning complex fintech problems into easy flows.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${anonymousPro.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <header className="absolute inset-x-0 top-48 z-10 flex justify-center">
          <MainMenu />
        </header>
        {children}
      </body>
    </html>
  );
}
