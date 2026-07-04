import type { SiteTranslation } from "./index";

export const uz: SiteTranslation = {
  appName: "Psixologiya ilmiy sektori",
  description:
    "TF MDU psixologiya yo‘nalishi materiallari, nashrlari va arxivi.",
  hero: {
    badge: "Psixologiya · MDU TF · talabalar",
    title: "Psixologiya ilmiy sektori",
    subtitle: "Nashrlar, atamalar, fanlar, arxiv va tadqiqot yo‘nalishlari — bir tuzilmada.",
    description:
      "Sayt o‘quv materiallari, nashrlar, glossariy va akademik hayot bilan bog‘liq bo‘limlarga tez o‘tishga yordam beradi.",
    publications: "Nashrlarni o‘qish",
    glossary: "Glossariyni ochish",
    disciplines: "Fanlarni ko‘rish",
    roadmap: "Talaba yo'li",
    studentPath: "Telegram-kanal · lug'at · fanlar · arxiv",
    viewAll: "Barcha nashrlarni ko'rish",
  },
  map: {
    heading: "Psixologiya xaritasi",
    description: "Saytning beshta asosiy bo'limi — xaritadagi tugunlar kabi",
    nodes: [
      {
        label: "Nashrlar",
        desc: "Materiallar va e'lonlar lentasi",
        href: "/uz/publications",
      },
      { label: "Lug'at", desc: "Psixologik lug'at", href: "/uz/glossary" },
      {
        label: "Fanlar",
        desc: "Semestrlar bo'yicha o'quv kurslari",
        href: "/uz/disciplines",
      },
      {
        label: "Yo'nalish",
        desc: "Talabaning fanga yo'li",
        href: "/uz/roadmap",
      },
      {
        label: "Arxiv",
        desc: "Yo'nalish tarixi va an'analari",
        href: "/uz/archive",
      },
    ],
  },
  trending: "So'nggi nashrlar",
  trendingSubtitle: "Lentadagi uchta so'nggi material.",
  trendingCta: "Barcha nashrlar",
  contact: {
    heading: "Kontaktlar",
    description:
      "MDU Toshkent filiali psixologiya yo'nalishining telefonlari, elektron pochtasi va rasmiy resurslari.",
    cta: "Barcha kontaktlar",
  },
  nav: {
    home: "Bosh sahifa",
    publications: "Nashrlar",
    glossary: "Glossariy",
    roadmap: "Yo'nalish",
    disciplines: "Fanlar",
    archive: "Arxiv",
    contacts: "Aloqa",
    telegram: "Telegram",
    menu: "Menyu",
    shortTitle: "Psixologiya sektori",
    subtitle: "psixologiya · TF",
    more: "Ko'proq",
  },
  footer: {
    description:
      "TF MDU psixologiya yo‘nalishi materiallari, nashrlari va arxivi.",
    linksLabel: "Bo'limlar",
    materialsLabel: "Materiallar",
    links: [
      { label: "Nashrlar", href: "/uz/publications" },
      { label: "Lug'at", href: "/uz/glossary" },
      { label: "Yo'nalish", href: "/uz/roadmap" },
      { label: "Fanlar", href: "/uz/disciplines" },
      { label: "Arxiv", href: "/uz/archive" },
      { label: "Aloqa", href: "/uz/contacts" },
    ],
    copyright: "© 2026",
    by: "by",
    address: "100060, Toshkent, Amir Temur ko'chasi, 22",
    telegram: "@psy_msutf",
    telegramUrl: "https://t.me/psy_msutf",
  },
  publications: {
    badge: "Kutubxona",
    title: "Nashrlar",
    desc: "Sayt va Telegram-kanal materiallari tozalangan, bo'limlarga ajratilgan va qidirish uchun ochiq.",
    back: "← Bosh sahifaga",
    search: "Nashrlar bo'yicha qidirish...",
    all: "Barchasi",
    reset: "Filterni bekor qilish",
    empty: "Bu bo'limda hozircha nashrlar yo'q",
    normalView: "Oddiy ko'rinish",
    compactView: "Yig'iq ko'rinish",
    rubric: "Bo'lim",
    clear: "Qidiruvni tozalash",
    read: "O'qish",
    section: "Bo'lim:",
    noPosts: "Bu bo'limda hozircha nashrlar yo'q",
    rubrics: {
      Все: "Barchasi",
      Анонсы: "E'lonlar",
      "Научная деятельность": "Ilmiy faoliyat",
      "Учебные материалы": "O'quv materiallari",
      Психопросвещение: "Psixo-ma'rifat",
      Возможности: "Imkoniyatlar",
      Итоги: "Natijalar",
      "Памятные даты": "Xotira sanalari",
      "О секторе": "Sektor haqida",
    },
  },
  glossary: {
    badge: "200+ atama",
    title: "Psixologik lug'at",
    relatedHeading: "Keyingi qadam",
    relatedCards: [
      {
        title: "Nashrlar",
        description:
          "E'lonlar, ilmiy faoliyat, o'quv materiallari va psixo-ma'rifat.",
        label: "O'tish",
      },
      {
        title: "Talabaning fanga yo'li",
        description:
          "MDU TF psixologiya yo'nalishi talabalari uchun 7 bosqichli interaktiv yo'nalish.",
        label: "O'tish",
      },
      {
        title: "Yo'nalish tarixi",
        description:
          "MDU TFda psixologiya qanday paydo bo'lgan: xronologiya, an'analar, 220-xona.",
        label: "O'tish",
      },
    ],
  },
  roadmap: {
    heading: "Bog'liq bo'limlar",
    relatedCards: [
      {
        title: "Lug'at",
        description:
          "Psixologik atamalar lug'ati ta'riflar va to'plamlar bilan.",
        label: "O'tish",
      },
      {
        title: "Nashrlar",
        description:
          "E'lonlar, ilmiy faoliyat, o'quv materiallari va psixo-ma'rifat.",
        label: "O'tish",
      },
      {
        title: "Arxiv va an'analar",
        description:
          "Xotira materiallari, talabalar an'analari va tarix sahifalari.",
        label: "O'tish",
      },
    ],
  },
  archive: {
    badge: "Arxiv",
    title: "Psixologiya yo'nalishi arxivi va an'analari",
    desc: "Xotira materiallari, talabalar an'analari va tarix sahifalari.",
    label: "Ochish",
    items: [
      {
        title: "Yo'nalish tarixi",
        description:
          "MDU Toshkent filialida psixologiya yo'nalishining qisqacha xronologiyasi.",
      },
      {
        title: "220-auditoriya",
        description:
          "220-auditoriya psixologiya yo'nalishi tarixi va keyingi kafedra hayoti bilan bog'liq.",
      },
      {
        title: "Ijtimoiy psixolog gimni",
        description:
          "Mualliflar G.M. Andreyeva va T.Y. Bazarov. Talabalar va bitiruvchilar uchrashuvlarida ijro etiladigan ballada arxiv matni.",
      },
      {
        title: "Psixologiya maktablari",
        description:
          "Moskva psixologiya maktabi an'analari: ma'ruzalar, manbalarni o'qish va talabalar loyihalari.",
      },
      {
        title: "Talabaning fanga yo'li",
        description:
          "Talabalar ilmiy jamiyati, qishki va bahorgi maktablar, metodologik seminarlar — talabalar ilmiy hayoti sahifalari.",
      },
      {
        title: "Yo'nalishning odamlari va an'analari",
        description:
          "Yo'nalishning odamlari va an'analari: asoschilar, ustozlar va shogirdlar an'analarni avloddan-avlodga uzatmoqda.",
      },
    ],
  },
  post: {
    back: "← Lentaga qaytish",
    backLabel: "Lentaga qaytish",
    readOriginal: "Asl nusxani Telegramda ochish",
    read: "O'qish",
    otherPosts: "Boshqa nashrlar",
    fromSection: "bo'limidan",
    ariaRead: "O'qish",
  },
  siteNotice: {
    publications: "Kanal materiallari hozircha asosan rus tilida mavjud.",
    glossary:
      "Glossariy atamalari hozircha rus tilida ko‘rsatiladi. O‘zbekcha versiya tayyorlanmoqda.",
    disciplines: "Fan nomlari o‘quv rejaga muvofiq rus tilida ko‘rsatilgan.",
  },
  glossaryUI: {
    termOfDay: "Kun termi",
    searchLabel: "Lug'at bo'yicha qidirish",
    searchPlaceholder:
      "Atamalar, kategoriyalar, qo'llanish sohalari bo'yicha qidirish...",
    alphabetFilter: "Alifbo bo'yicha filtr",
    all: "Barchasi",
    categoryFilter: "Kategoriya bo'yicha filtr",
    filtersLabel: "Filterlar",
    relatedLabel: "Bog'liq",
    sort: "A—Ya",
    random: "Tasodifiy",
    nothingFound: "Hech narsa topilmadi",
    resetFilters: "Filtrlarni bekor qilish",
    tryChanging: "Qidiruv so'rovini o'zgartiring yoki filtrlarni bekor qiling",
    randomTermLabel: "Tasodifiy atama",
    showMore: "Yana ko'rsatish",
    collections: "Atamalar to'plami",
    collectionsDesc: "O'rganish uchun tematik to'plamlar",
    foundCount: "{total} ta atamadan {found} tasi topildi",
    relatedMaterials: "Bog'liq materiallar",
    relatedCard1Title: "Talabaning fanga yo'li",
    relatedCard1Desc:
      "Yo'nalish tanlashdan nashrgacha bosqichma-bosqich yo'nalish",
    relatedCard2Title: "Nashrlar",
    relatedCard2Desc: "E'lonlar, o'quv materiallari va ilmiy faoliyat lentasi.",
    relatedCard3Title: "Arxiv va an'analar",
    relatedCard3Desc:
      "Psixologiya yo'nalishining tarixi, an'analari va bosqichlari.",
    colFirstYear: "Birinchi kurs uchun",
    colFirstYearDesc:
      "Boshlang'ich talabalar uchun asosiy psixologik tushunchalar.",
    colCoursework: "Kurs ishi va bitiruv ishi uchun",
    colCourseworkDesc: "O'lchash, metodologiya va ilmiy yozish atamalari.",
    colPsychodiagnostics: "Psixodiagnostika uchun",
    colPsychodiagnosticsDesc:
      "Testlash, validslik, ishonchlilik va baholash usullari.",
    colSocialPsychology: "Ijtimoiy psixologiya uchun",
    colSocialPsychologyDesc:
      "Guruh dinamikasi, yetakchilik, idrok va ijtimoiy ta'sir.",
    colClinicalPsychology: "Klinik psixologiya uchun",
    colClinicalPsychologyDesc:
      "Buzilishlar, himoya mexanizmlari, travma va terapiya.",
    colNeuropsychology: "Neyropsixologiya uchun",
    colNeuropsychologyDesc:
      "Miya faoliyati, neyroplastiklik va sensor jarayonlar.",
    colPsychoeducation: "Psixoma'rifat uchun",
    colPsychoeducationDesc:
      "Emotsional intellekt, empatiya, o'z-o'zini anglash va o'sish.",
    colNegotiationPsychology: "Muzokaralar psixologiyasi uchun",
    colNegotiationPsychologyDesc:
      "Munosabat, konformizm, muloqot va yetakchilik.",
  },
  roadmapUI: {
    backToHome: "Bosh sahifaga",
    badge: "Talaba yo'li",
    heading: "Talaba yo'li",
    headingLine2: "fanga",
    description:
      "Birinchi qiziqishdan o'quv yoki ilmiy loyihagacha yetti qadam. Har bir qadam aniq harakatlar, foydali havolalar va natijani o'z ichiga oladi. Tugallangan bosqichlarni belgilang.",
    actions: "Nima qilish kerak",
    links: "Qayerga o'tish",
    result: "Bosqich natijasi",
    done: "Bajarildi",
    mark: "Belgilash",
    completed: "Yo'l tugallandi!",
    reset: "Progressni tiklash",
  },
  disciplinesUI: {
    bachelor: "Bakalavriat",
    master: "Magistratura",
    program: "Ta'lim darajasi",
    course: "Kurs",
    title: "Kurslar bo'yicha fanlar",
    description:
      "Fanlar ro'yxatini ko'rish uchun ta'lim darajasi va kursni tanlang.",
    searchPlaceholder: "Fanlarni qidirish...",
    searchLabel: "Fanlarni qidirish",
    nothingFound: "Hech narsa topilmadi",
    reset: "Tozalash",
    tryChanging: "Qidiruv so'rovini o'zgartiring",
    subjects: "fan",
    foundCount: "Topilgan fanlar",
  },
  contactsUI: {
    extraContacts: "Qo'shimcha kontaktlar",
    officialLinks: "Rasmiy havolalar",
    additionalOfficialContacts: "Qo'shimcha rasmiy kontaktlar",
  },
};
