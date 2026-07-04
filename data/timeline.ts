export interface ScienceRoadmapStep {
  step: number;
  title: string;
  description: string;
  link: string;
  source: "static";
}

export interface AcademicTimelineEntry {
  year: string;
  title: string;
  description: string;
  source: "static";
}

export const scienceRoadmap: ScienceRoadmapStep[] = [
  {
    step: 1,
    title: "Выбор направления",
    description:
      "Определите область психологии, которая вас интересует: когнитивная, социальная, клиническая, организационная или возрастная психология.",
    link: "/collections#science-start",
    source: "static",
  },
  {
    step: 2,
    title: "Знакомство с литературой",
    description:
      "Изучите фундаментальные работы по выбранной теме: учебники, монографии, классические статьи. Составьте библиографию.",
    link: "/collections#classic-readings",
    source: "static",
  },
  {
    step: 3,
    title: "Постановка проблемы",
    description:
      "Сформулируйте исследовательский вопрос и рабочую гипотезу. Определите объект, предмет, цель и задачи исследования.",
    link: "/collections#science-start",
    source: "static",
  },
  {
    step: 4,
    title: "Выбор методов",
    description:
      "Подберите методы и методики, соответствующие цели исследования. Учтите их валидность, надёжность и этические аспекты.",
    link: "/collections#tools-methods",
    source: "static",
  },
  {
    step: 5,
    title: "Сбор данных",
    description:
      "Проведите пилотажное и основное исследование. Соберите эмпирические данные, ведите протоколы и документацию.",
    link: "/collections#modern-research",
    source: "static",
  },
  {
    step: 6,
    title: "Анализ и интерпретация",
    description:
      "Обработайте полученные данные методами математической статистики. Интерпретируйте результаты в контексте теоретической рамки.",
    link: "/collections#tools-methods",
    source: "static",
  },
  {
    step: 7,
    title: "Публикация и апробация",
    description:
      "Оформите результаты в виде статьи, доклада или презентации. Выступите на конференции и опубликуйте результаты.",
    link: "/collections#conference-prep",
    source: "static",
  },
];

export const academicTimeline: AcademicTimelineEntry[] = [
  {
    year: "2005",
    title: "Основание Ташкентского филиала МГУ",
    description:
      "Открытие Ташкентского филиала Московского государственного университета имени М. В. Ломоносова — начало академического присутствия МГУ в Центральной Азии.",
    source: "static",
  },
  {
    year: "2006",
    title: "Начало психологического образования в ТФ МГУ",
    description:
      "Начата подготовка бакалавров по направлению «Психология» в Ташкентском филиале МГУ.",
    source: "static",
  },
  {
    year: "2011",
    title: "Юридическое оформление кафедры психологии",
    description:
      "Кафедра психологии зарегистрирована как самостоятельное структурное подразделение Ташкентского филиала МГУ.",
    source: "static",
  },
  {
    year: "2020",
    title: "Переход на дистанционные форматы",
    description:
      "В связи с пандемией кафедра оперативно перешла на онлайн-формат обучения, сохранив качество образования и научной работы.",
    source: "static",
  },
  {
    year: "2024",
    title: "Научный сектор психологии",
    description:
      "Активизация работы студенческого научного сектора: регулярные семинары, публикационная активность, участие в грантовых программах.",
    source: "static",
  },
  {
    year: "2026",
    title: "Кафедра сегодня",
    description:
      "Кафедра продолжает развитие в традициях Московского университета, ведётся научная работа и поддерживается международное сотрудничество.",
    source: "static",
  },
];
