import type { Metadata } from "next";
import { BauhausBackground } from "@/components/bauhaus-background";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ContactCard } from "@/components/contact-card";
import { ExtraContactsSection } from "@/components/extra-contacts-section";
import { mainContacts } from "@/data";
import { getTranslations } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  return {
    title: `${t.contact.heading} — ${t.appName}`,
    description: t.contact.description,
    openGraph: {
      title: `${t.contact.heading} — ${t.appName}`,
      description: t.contact.description,
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.contact.heading} — ${t.appName}`,
      description: t.contact.description,
    },
  };
}

export default async function LangContactsPage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <BauhausBackground variant="contacts" />

      <AnimateOnScroll
        as="section"
        className="relative border-b-2 border-bauhaus-blue/10 scroll-mt-[72px] lg:scroll-mt-24"
        direction="up"
      >
        <div className="container mx-auto px-4 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue bg-bauhaus-blue/5 w-fit mx-auto">
              {t.contact.heading}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tighter uppercase">
              {t.contact.heading}
            </h1>
            <div className="mx-auto mt-4 h-1 w-16 bg-bauhaus-blue" />
            <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-[580px] leading-relaxed mx-auto">
              {t.contact.description}
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="border-b-2 border-bauhaus-blue/10"
        direction="up"
      >
        <div className="container mx-auto px-4 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[960px] mx-auto">
            {mainContacts.map((contact) => (
              <ContactCard key={contact.title} contact={contact} />
            ))}
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="border-b-2 border-bauhaus-blue/10"
        direction="up"
      >
        <div className="container mx-auto px-4 py-10 sm:py-12">
          <div className="max-w-[640px] mx-auto">
            <div className="bauhaus-card bauhaus-card-hover p-6 sm:p-8">
              <ExtraContactsSection label={t.contactsUI.extraContacts} />
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
