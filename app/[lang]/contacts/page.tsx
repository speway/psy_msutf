import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
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
      <SectionIntro
        title={t.contact.heading}
        description={t.contact.description}
        eyebrow={t.nav.contacts}
        number="06"
        lang={lang}
      />

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
