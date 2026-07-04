export interface OfficialLink {
  title: string;
  url: string;
  description: string;
  source: "static";
}

export interface ExtraContact {
  label: string;
  value: string;
  type: "phone" | "email" | "link";
}

export interface MainContact {
  title: string;
  description: string;
  phone?: string;
  email?: string;
  link?: { label: string; url: string };
  source: "static";
}

export const officialLinks: OfficialLink[] = [
  {
    title: "Ташкентский филиал МГУ",
    url: "https://msu.uz",
    description:
      "Официальный сайт Ташкентского филиала МГУ имени М. В. Ломоносова.",
    source: "static",
  },
  {
    title: "Факультет психологии",
    url: "https://msu.uz/psyfaculty",
    description:
      "Страница факультета психологии Ташкентского филиала МГУ имени М. В. Ломоносова.",
    source: "static",
  },
  {
    title: "Контакты филиала",
    url: "https://msu.uz/contacts",
    description:
      "Официальная страница контактов Ташкентского филиала МГУ имени М. В. Ломоносова.",
    source: "static",
  },
];

export const mainContacts: MainContact[] = [
  {
    title: "Telegram-канал @psy_msutf",
    description:
      "Официальный Telegram-канал психологического направления ТФ МГУ. Новости, анонсы, научные публикации.",
    link: { label: "t.me/psy_msutf", url: "https://t.me/psy_msutf" },
    source: "static",
  },
  {
    title: "Факультет психологии ТФ МГУ",
    description:
      "Факультет психологии Ташкентского филиала МГУ имени М. В. Ломоносова.",
    phone: "+998 (71) 232-28-11",
    link: { label: "msu.uz/psyfaculty", url: "https://msu.uz/psyfaculty" },
    source: "static",
  },
  {
    title: "Филиал МГУ в Ташкенте",
    description:
      "Ташкентский филиал Московского государственного университета имени М. В. Ломоносова.",
    link: { label: "msu.uz", url: "https://msu.uz" },
    source: "static",
  },
  {
    title: "Общие контакты филиала",
    description:
      "Общие контакты Ташкентского филиала МГУ имени М. В. Ломоносова.",
    email: "info@msu.uz",
    link: { label: "msu.uz/contacts", url: "https://msu.uz/contacts" },
    source: "static",
  },
];

export const extraOfficialContacts: ExtraContact[] = [
  {
    label: "Приёмная исполнительного директора",
    value: "+998 (71) 232-28-01",
    type: "phone",
  },
  {
    label: "Канцелярия и телефон доверия",
    value: "+998 (71) 233-58-26",
    type: "phone",
  },
  {
    label: "Факультет прикладной математики и информатики",
    value: "+998 (71) 232-28-22",
    type: "phone",
  },
  {
    label: "Подготовительные курсы",
    value: "+998 (71) 233-87-88",
    type: "phone",
  },
  {
    label: "Главный бухгалтер",
    value: "+998 (71) 236-30-60",
    type: "phone",
  },
  {
    label: "Планово-финансовый отдел и маркетинг",
    value: "+998 (71) 232-07-33",
    type: "phone",
  },
  {
    label: "Отдел кадров",
    value: "+998 (71) 232-28-10",
    type: "phone",
  },
  {
    label: "Межведомственная и правительственная переписка",
    value: "msu@exat.uz",
    type: "email",
  },
];
