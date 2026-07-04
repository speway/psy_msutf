import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkipLink } from "@/components/skip-link";
import { Toaster } from "@/components/ui/sonner";

const appName = "Научный сектор психологии";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: appName,
  description:
    "Публикации, термины, дисциплины, архив и маршруты исследовательской работы.",
  openGraph: {
    title: appName,
    description:
      "Публикации, термины, дисциплины, архив и маршруты исследовательской работы.",
    type: "website",
    locale: "ru_RU",
    siteName: appName,
    images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description:
      "Публикации, термины, дисциплины, архив и маршруты исследовательской работы.",
    images: ["/og/og-main.png"],
  },
  alternates: {
    languages: {
      ru: "/ru",
      en: "/en",
      uz: "/uz",
      "x-default": "/ru",
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#4a1028",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value;
  const htmlLang =
    langCookie === "en" || langCookie === "uz" ? langCookie : "ru";

  return (
    <html lang={htmlLang} className="font-sans" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme')||'academic';document.documentElement.setAttribute('data-theme',t);}catch(e){}})()",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var l=localStorage.getItem('lang');if(l){document.documentElement.setAttribute('lang',l);}}catch(e){}})()",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('reading-mode')==='true'){document.body.classList.add('reading-mode');}var fs=localStorage.getItem('font-scale');if(fs){document.documentElement.style.setProperty('--font-scale',fs);}}catch(e){}})()",
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('presentation-mode')==='true'){document.body.classList.add('presentation-mode');}}catch(e){}})()",
          }}
        />
        <SkipLink />
        <SiteHeader />
        <main
          id="main-content"
          className="flex-1 page-reveal"
        >
          {children}
        </main>
        <SiteFooter />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
