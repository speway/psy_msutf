import type { SiteTranslation } from "./index";

export const en: SiteTranslation = {
  appName: "Scientific Sector of Psychology",
  description:
    "Materials, publications and archive of the psychology track at MSU Tashkent Branch.",
  hero: {
    badge: "Psychology · MSU TF · students",
    title: "Scientific Sector of Psychology",
    subtitle: "Publications, terms, disciplines, archive and research routes — all in one structure.",
    description:
      "The site helps students quickly access study materials, publications, the glossary and sections connected with academic life.",
    publications: "Read publications",
    glossary: "Open glossary",
    disciplines: "View disciplines",
    roadmap: "Student Path",
    studentPath: "Telegram channel · glossary · disciplines · archive",
    viewAll: "View all publications",
  },
  map: {
    heading: "Psychology Map",
    description: "Five key sections of the site — like nodes on a map",
    nodes: [
      {
        label: "Publications",
        desc: "Feed of materials and announcements",
        href: "/en/publications",
      },
      {
        label: "Glossary",
        desc: "Psychological dictionary of terms",
        href: "/en/glossary",
      },
      {
        label: "Disciplines",
        desc: "Course list by semester",
        href: "/en/disciplines",
      },
      {
        label: "Roadmap",
        desc: "Student path to science",
        href: "/en/roadmap",
      },
      { label: "Archive", desc: "History and traditions", href: "/en/archive" },
    ],
  },
  trending: "Latest publications",
  trendingSubtitle: "Three latest materials from the feed.",
  trendingCta: "All publications",
  contact: {
    heading: "Contacts",
    description:
      "Phone numbers, email and official resources of the Psychology Programme at Tashkent Branch of MSU.",
    cta: "All contacts",
  },
  nav: {
    home: "Home",
    publications: "Publications",
    glossary: "Glossary",
    roadmap: "Roadmap",
    disciplines: "Disciplines",
    archive: "Archive",
    contacts: "Contacts",
    telegram: "Telegram",
    menu: "Menu",
    shortTitle: "Scientific Sector",
    subtitle: "psychology · Tashkent Branch",
    more: "More",
  },
  footer: {
    description:
      "Materials, publications and archive of the psychology track at MSU Tashkent Branch.",
    linksLabel: "Sections",
    materialsLabel: "Materials",
    links: [
      { label: "Publications", href: "/en/publications" },
      { label: "Glossary", href: "/en/glossary" },
      { label: "Roadmap", href: "/en/roadmap" },
      { label: "Disciplines", href: "/en/disciplines" },
      { label: "Archive", href: "/en/archive" },
      { label: "Contacts", href: "/en/contacts" },
    ],
    copyright: "© 2026",
    by: "by",
    address: "100060, Tashkent, Amir Temur Street, 22",
    telegram: "@psy_msutf",
    telegramUrl: "https://t.me/psy_msutf",
  },
  publications: {
    badge: "Library",
    title: "Publications",
    desc: "Site and Telegram channel materials, cleaned up, organized by section and searchable.",
    back: "← Back to home",
    search: "Search publications...",
    all: "All",
    reset: "Reset filter",
    empty: "No publications in this section yet",
    normalView: "Normal view",
    compactView: "Compact view",
    rubric: "Section",
    clear: "Clear search",
    read: "Read",
    section: "Section:",
    noPosts: "No publications in this section yet",
    rubrics: {
      Все: "All",
      Анонсы: "Announcements",
      "Научная деятельность": "Research",
      "Учебные материалы": "Study Materials",
      Психопросвещение: "Psychoeducation",
      Возможности: "Opportunities",
      Итоги: "Results",
      "Памятные даты": "Memorial Dates",
      "О секторе": "About the Sector",
    },
  },
  glossary: {
    badge: "200+ terms",
    title: "Psychological Glossary",
    relatedHeading: "Where to go next",
    relatedCards: [
      {
        title: "Publications",
        description:
          "Announcements, research activities, study materials and psychoeducation.",
        label: "Go",
      },
      {
        title: "Student path to science",
        description:
          "Interactive 7-step roadmap for psychology students at Tashkent Branch of MSU.",
        label: "Go",
      },
      {
        title: "History of the programme",
        description:
          "How psychology emerged at Tashkent Branch of MSU: chronology, traditions, room 220.",
        label: "Go",
      },
    ],
  },
  roadmap: {
    heading: "Related sections",
    relatedCards: [
      {
        title: "Glossary",
        description:
          "Psychological dictionary of terms with definitions and collections.",
        label: "Go",
      },
      {
        title: "Publications",
        description:
          "Announcements, research activities, study materials and psychoeducation.",
        label: "Go",
      },
      {
        title: "Archive and traditions",
        description:
          "Memorial materials, student traditions and history pages.",
        label: "Go",
      },
    ],
  },
  archive: {
    badge: "Archive",
    title:
      "Archive and traditions of the student community and psychology programme",
    desc: "Memorial materials, student traditions and history pages.",
    label: "Open",
    items: [
      {
        title: "History of the programme",
        description:
          "A brief chronology of the psychology track at MSU Tashkent Branch.",
      },
      {
        title: "Auditorium №220",
        description:
          "Auditorium №220 is connected with the history of the psychology track and later departmental life.",
      },
      {
        title: "Social Psychologist's Anthem",
        description:
          "Words by G.M. Andreyeva, music by T.Y. Bazarov. Archival text of the ballad performed at student and graduate gatherings.",
      },
      {
        title: "Psychological schools",
        description:
          "Traditions of the Moscow School of Psychology: lectures, primary source reading, and student projects.",
      },
      {
        title: "Student path to science",
        description:
          "Student research society, winter and spring schools, methodology seminars — pages of student research life.",
      },
      {
        title: "People and traditions of the programme",
        description:
          "People and traditions of the programme: founder, mentors and students passing traditions from generation to generation.",
      },
    ],
  },
  post: {
    back: "← Back to feed",
    backLabel: "Back to feed",
    readOriginal: "Open original in Telegram",
    read: "Read",
    otherPosts: "Other publications",
    fromSection: "from section",
    ariaRead: "Read",
  },
  siteNotice: {
    publications:
      "Channel publications are currently available primarily in Russian.",
    glossary:
      "Glossary terms are currently displayed in Russian while the English version is being prepared.",
    disciplines:
      "Discipline names are displayed in Russian according to the curriculum.",
  },
  glossaryUI: {
    termOfDay: "Term of the day",
    searchLabel: "Search glossary",
    searchPlaceholder: "Search terms, categories, applications...",
    alphabetFilter: "Filter by alphabet",
    all: "All",
    categoryFilter: "Filter by category",
    filtersLabel: "Filters",
    relatedLabel: "Related",
    sort: "A—Z",
    random: "Random",
    nothingFound: "Nothing found",
    resetFilters: "Reset filters",
    tryChanging: "Try changing your search query or reset filters",
    randomTermLabel: "Random term",
    showMore: "Show more",
    collections: "Term collections",
    collectionsDesc: "Thematic collections for learning",
    foundCount: "Found {found} of {total} terms",
    relatedMaterials: "Related materials",
    relatedCard1Title: "Student Path to Science",
    relatedCard1Desc:
      "Step-by-step route from choosing a direction to publication",
    relatedCard2Title: "Publications",
    relatedCard2Desc:
      "Feed of channel announcements, study materials and research.",
    relatedCard3Title: "Archive and traditions",
    relatedCard3Desc:
      "History, traditions and milestones of the psychology programme.",
    colFirstYear: "For first-year students",
    colFirstYearDesc: "Core psychological concepts for beginning students.",
    colCoursework: "For coursework and thesis",
    colCourseworkDesc: "Measurement, methodology, and academic writing terms.",
    colPsychodiagnostics: "For psychodiagnostics",
    colPsychodiagnosticsDesc:
      "Testing, validity, reliability, and assessment methods.",
    colSocialPsychology: "For social psychology",
    colSocialPsychologyDesc:
      "Group dynamics, leadership, perception, and social influence.",
    colClinicalPsychology: "For clinical psychology",
    colClinicalPsychologyDesc:
      "Disorders, defense mechanisms, trauma, and therapy approaches.",
    colNeuropsychology: "For neuropsychology",
    colNeuropsychologyDesc:
      "Brain function, neuroplasticity, and sensory processes.",
    colPsychoeducation: "For psychoeducation",
    colPsychoeducationDesc:
      "Emotional intelligence, empathy, self-awareness, and growth.",
    colNegotiationPsychology: "For negotiation psychology",
    colNegotiationPsychologyDesc:
      "Attitudes, conformity, communication, and leadership.",
  },
  roadmapUI: {
    backToHome: "Back to home",
    badge: "Student Path",
    heading: "Student Path",
    headingLine2: "to Science",
    description:
      "Seven steps: from first interest to an educational or scientific project. Each step contains specific actions, useful links and a result. Mark completed steps.",
    actions: "Actions",
    links: "Where to go",
    result: "Step result",
    done: "Done",
    mark: "Mark",
    completed: "Path completed!",
    reset: "Reset progress",
  },
  disciplinesUI: {
    bachelor: "Bachelor's degree",
    master: "Master's degree",
    program: "Education level",
    course: "Year",
    title: "Disciplines by year",
    description:
      "Choose the education level and year to see the list of disciplines.",
    searchPlaceholder: "Search disciplines...",
    searchLabel: "Search disciplines",
    nothingFound: "Nothing found",
    reset: "Reset",
    tryChanging: "Try changing your search query",
    subjects: "disciplines",
    foundCount: "Disciplines found",
  },
  contactsUI: {
    extraContacts: "Additional contacts",
    officialLinks: "Official links",
    additionalOfficialContacts: "Additional official contacts",
  },
};
