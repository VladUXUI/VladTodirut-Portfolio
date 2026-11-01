import type { Metadata } from "next";
import { Anonymous_Pro, DM_Sans } from "next/font/google";
import { Footer } from "@/components/footer/Footer";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { Loader } from "@/components/intro/Loader";
import { MainMenu } from "@/components/nav/MainMenu";
import { site } from "@/content/site";
import { pageMetadata } from "./shared-metadata";
import { JsonLd, siteGraph } from "./structured-data";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous-pro",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/* metadataBase makes the share image and canonical URLs absolute */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...pageMetadata({
    title: "Vlad Todirut — Senior Product Designer",
    description:
      "Senior product designer in Gothenburg, open to remote. 15 years on fintech and crypto products where a wrong click costs real money, plus design systems and building with AI.",
    path: "/",
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${anonymousPro.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <JsonLd graph={siteGraph} />
        <IntroProvider>
          <Loader />
          <noscript>
            <style>{"#site-loader{display:none}"}</style>
          </noscript>
          <header className="absolute inset-x-0 top-48 z-10 flex justify-center">
            <MainMenu />
          </header>
          {children}
          <Footer />
        </IntroProvider>
      </body>
    </html>
  );
}
