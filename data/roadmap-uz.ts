import type { RoadmapStep } from "./roadmap";

export const roadmapStepsUz: RoadmapStep[] = [
  {
    step: 1,
    title: "Yo'nalish tanlash",
    description:
      "Psixologiyaning turli sohalariga qarang: kognitiv, ijtimoiy, klinik, tashkiliy yoki rivojlanish psixologiyasi. Sizni nima qiziqtirishini o'ylab ko'ring.",
    actions: [
      "Psixologiyada qanday mavzular borligini ko'rib chiqing",
      "Sizga nima eng qiziqarli ekanini aniqlang",
      "O'qituvchilar va yuqori kurs talabalari bilan suhbatlashing",
      "Ilmiy sektor yig'ilishiga qatnashing",
    ],
    links: [
      { title: "Yo'nalish tarixi", url: "/history" },
      { title: "Arxiv va an'analar", url: "/archive" },
      { title: "Tematik to'plamlar", url: "/glossary" },
    ],
    result: "Mumkin bo'lgan mavzu va keyingi qadam haqida tushuncha",
  },
  {
    step: 2,
    title: "Adabiyot bilan tanishish",
    description:
      "Mavzuingiz bo'yicha fundamental ishlarni o'qing: darsliklar, monografiyalar, klassik maqolalar. Dastlabki bibliografiyani to'plang.",
    actions: [
      "Mavzuingiz bo'yicha darslik va monografiyalarni toping",
      "Ilmiy jurnallardagi klassik maqolalarni o'qing",
      "Adabiyotlar ro'yxatini tuzing",
      "Asosiy g'oyalar va yondashuvlarni yozib oling",
    ],
    links: [
      { title: "Atamalar lug'ati", url: "/glossary" },
      { title: "Arxiv va an'analar", url: "/archive" },
      { title: "Nashrlar", url: "/publications" },
    ],
    result: "Birlamchi bibliografiyaga ega nazariy asos",
  },
  {
    step: 3,
    title: "Muammoni aniqlash",
    description:
      "Tadqiqot savolingiz va ishchi gipotezangizni shakllantiring. Aynan nimani aniqlamoqchi ekanligingizni belgilang.",
    actions: [
      "Mavjud tadqiqotlardagi bo'shliqni toping",
      "Javob bermoqchi bo'lgan savolni shakllantiring",
      "Gipotezani ilgari suring — taxminingiz",
      "Ob'ekt, predmet, maqsad va vazifalarni belgilang",
    ],
    links: [
      {
        title: "Nashrlar",
        url: "/publications",
      },
      { title: "Yo'nalish tarixi", url: "/history" },
    ],
    result: "Tayyor tadqiqot ramkasi: savol, gipoteza, maqsad va vazifalar",
  },
  {
    step: 4,
    title: "Metodlarni tanlash",
    description:
      "Maqsadingizga mos metod va usullarni tanlang. Validlik, ishonchlilik va etikani tekshiring.",
    actions: [
      "Qanday metodlar borligini ko'rib chiqing",
      "Gipotezangizga mos usullarni tanlang",
      "Ularning valid va ishonchli ekanligini tekshiring",
      "Dizaynni ilmiy rahbar bilan muhokama qiling",
    ],
    links: [
      { title: "Atamalar lug'ati", url: "/glossary" },
      { title: "Arxiv va an'analar", url: "/archive" },
    ],
    result: "Vazifangizga mos usullar to'plami bilan o'ylangan dizayn",
  },
  {
    step: 5,
    title: "Ma'lumot to'plash",
    description:
      "Pilotaj va asosiy tadqiqotni o'tkazing. Ma'lumotlarni to'plang, protokollarni yuriting.",
    actions: [
      "Avval usullarni kichik namunada sinab ko'ring",
      "Pilotajdan so'ng protsedurani tuzating",
      "Asosiy ma'lumot to'plashni o'tkazing",
      "Protokollarni yuriting va hamma narsani tartibga soling",
    ],
    links: [
      { title: "Arxiv va an'analar", url: "/archive" },
      {
        title: "Nashrlar",
        url: "/publications",
      },
    ],
    result: "Qayta ishlash uchun to'plangan empirik material",
  },
  {
    step: 6,
    title: "Tahlil va talqin",
    description:
      "Ma'lumotlarni statistika yordamida qayta ishlang. Natijalarni talqin qiling — ular mavzuingiz kontekstida nimani anglatadi.",
    actions: [
      "Qanday statistik metodlarni qo'llashni tanlang",
      "Miqdoriy va sifat tahlilini o'tkazing",
      "Natijalar gipotezangiz haqida nima deyishini ko'ring",
      "Asosiy xulosalarni shakllantiring",
    ],
    links: [
      { title: "Atamalar lug'ati", url: "/glossary" },
      { title: "Arxiv va an'analar", url: "/archive" },
    ],
    result: "Asoslangan xulosalar — natijalar nimani ko'rsatadi",
  },
  {
    step: 7,
    title: "Natijalarni taqdim etish",
    description:
      "Natijalarni ma'ruza yoki taqdimot shaklida tayyorlang. Seminar yoki konferensiyada qatnashing va natijalarni muhokama qiling.",
    actions: [
      "Chiqish matnini tayyorlang",
      "Ma'ruza yoki taqdimot tayyorlang",
      "'Zamonaviy dunyoda psixologiya' konferensiyasida qatnashing",
      "Muhokama uchun material tayyorlang",
    ],
    links: [
      { title: "Nashrlar", url: "/publications" },
      { title: "Arxiv va an'analar", url: "/archive" },
    ],
    result: "O'quv yoki ilmiy loyiha uchun tayyor ma'ruza yoki taqdimot",
  },
];
