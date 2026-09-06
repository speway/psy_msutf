import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { getTranslations, localizeHref } from "@/lib/i18n";

export function SectionIntro({
  title,
  description,
  eyebrow,
  number,
  lang,
}: {
  title: string;
  description?: string;
  eyebrow: string;
  number: string;
  lang: string;
}) {
  const t = getTranslations(lang);
  return (
    <section className="section-intro">
      <div className="container">
        <div className="section-intro-top">
          <Link href={localizeHref("/", lang)}>
            <ArrowUpLeft size={16} aria-hidden="true" />
            {t.nav.shortTitle}
          </Link>
          <span>{eyebrow}</span>
        </div>
        <div className="section-intro-main">
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          <span className="section-intro-index" aria-hidden="true">
            {number}
          </span>
        </div>
      </div>
    </section>
  );
}
