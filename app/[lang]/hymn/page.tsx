import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, localizeHref } from "@/lib/i18n";
import { PsiDecor } from "@/components/psi-decor";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const appName = getTranslations(lang).appName;

  return {
    title: `${lang === "uz" ? "Ijtimoiy psixolog balladasi (Gimni)" : lang === "en" ? "Ballad (Hymn) of the Social Psychologist" : "Баллада (Гимн) социального психолога"} — ${appName}`,
    description:
      lang === "uz"
        ? "«Ijtimoiy psixolog balladasi (Gimni)». Muallif: G.M. Andreyeva, musiqa: T.Yu. Bazarov."
        : lang === "en"
          ? '"Ballad (Hymn) of the Social Psychologist". Words by G.M. Andreeva, music by T.Yu. Bazarov.'
          : "«Баллада (Гимн) социального психолога». Слова Г.М. Андреевой, музыка Т.Ю. Базарова.",
  };
}

const STANZAS = [
  [
    "Ты покидаешь «Альму-Матерь»,",
    "Усвоив уйму всяких знаний.",
    "Из них, как общий знаменатель,",
    "Ты извлеки ряд пожеланий:",
  ],
  [
    "В общенье будь ты компетентным,",
    "Владей искусством интеракций,",
    "Будь хоть не явным, но латентным",
    "Производителем аттракций.",
  ],
  [
    "И коль вербалику заело,",
    "Включай ты мимику тотчас,",
    "И жесты рук, и позы тела,",
    "И, наконец, контакты глаз.",
  ],
  [
    "Атрибутивные модели,",
    "Как средство, очень хороши:",
    "По ним причины поведенья,",
    "Коль их не знаешь, — припиши!",
  ],
  [
    "В межгрупповом соревнованье",
    "Не исповедуй эгоизм",
    "И истребляй до основанья",
    "Ингрупповой фаворитизм.",
  ],
  [
    "И коль проявишь ты тактичность,",
    "Не будешь в поведенье глуп,",
    "Приобретешь ты идентичность",
    "Среди больших и малых групп.",
  ],
  [
    "Пик твоего самосознанья",
    "Наступит в тот святой момент,",
    "Когда поймешь других желанья,",
    "Как будто сам ты свой клиент…",
  ],
  [
    "И чтоб не был твой путь печальным,",
    "Ты повторяй себе стократ:",
    "«Ведь я — ПСИХОЛОГ СОЦИАЛЬНЫЙ,",
    "Народу лучший друг и брат!»",
  ],
];

export default async function LangHymnPage({ params }: Props) {
  const { lang } = await params;
  const lh = (href: string) => localizeHref(href, lang);

  const backLabel =
    lang === "uz"
      ? "Bosh sahifaga"
      : lang === "en"
        ? "To home page"
        : "На главную";
  const wordsLabel = lang === "uz" ? "So'z" : lang === "en" ? "Words" : "Слова";
  const musicLabel =
    lang === "uz" ? "Musiqa" : lang === "en" ? "Music" : "Музыка";

  return (
    <div className="relative animate-in fade-in duration-700 ">
      {/* Ψ decor — top-right hero */}
      <PsiDecor
        className="absolute top-8 right-[5%] text-8xl sm:text-9xl hidden sm:block"
        style={{ transform: "rotate(-10deg)" }}
      />
      {/* Ψ decor — bottom-left */}
      <PsiDecor
        className="absolute bottom-8 left-[5%] text-6xl sm:text-7xl hidden sm:block"
        style={{ transform: "rotate(18deg)" }}
      />
      <article className="container mx-auto px-4 py-12 md:py-20 max-w-2xl relative">
        <Link
          href={lh("/")}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A1028]/60 hover:text-[#4A1028] transition-colors mb-8 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          {backLabel}
        </Link>

        <div className="mb-6 h-px w-20 bg-[#4A1028]/30" />

        <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-snug tracking-normal text-[#4A1028] mb-2">
          {lang === "uz" ? "Ballada" : lang === "en" ? "Ballad" : "Баллада"}
          <br />
          <span className="italic font-medium text-[#4A1028]/70">
            ({lang === "uz" ? "Gimn" : lang === "en" ? "Hymn" : "Гимн"})
          </span>{" "}
          {lang === "uz"
            ? "ijtimoiy psixolog"
            : lang === "en"
              ? "of the Social Psychologist"
              : "социального психолога"}
        </h1>

        <div className="flex flex-col gap-1 mt-4 mb-10 pb-8 border-b border-[#4A1028]/15">
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[#4A1028]/50">
            {wordsLabel} — <span className="text-[#4A1028]">Г.М. Андреева</span>
          </p>
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[#4A1028]/50">
            {musicLabel} — <span className="text-[#4A1028]">Т.Ю. Базаров</span>
          </p>
        </div>

        <div className="relative">
          {STANZAS.map((stanza, stanzaIndex) => (
            <div
              key={stanzaIndex}
              className="mb-7 last:mb-0 animate-in fade-in duration-700"
              style={{ animationDelay: `${200 + stanzaIndex * 80}ms` }}
            >
              {stanza.map((line, lineIndex) => (
                <p
                  key={lineIndex}
                  className="text-base md:text-lg leading-relaxed text-[#4A1028]/80 font-serif"
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#4A1028]/15">
          <div className="h-px w-14 bg-[#4A1028]/30" />
          <p className="mt-3 text-[10px] font-sans text-[#4A1028]/40 uppercase tracking-wider">
            10 Саммит психологов, Санкт-Петербург, 5 июня 2016 г.
          </p>
        </div>
      </article>
    </div>
  );
}
