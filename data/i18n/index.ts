export interface HeroTranslation {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  publications: string;
  glossary: string;
  disciplines: string;
  roadmap: string;
  studentPath: string;
  viewAll: string;
}

export interface HowToTranslation {
  heading: string;
  scenarios: Array<{
    title: string;
    desc: string;
  }>;
}

export interface ContactTranslation {
  heading: string;
  description: string;
  cta: string;
}

export interface NavTranslation {
  home: string;
  publications: string;
  glossary: string;
  roadmap: string;
  disciplines: string;
  archive: string;
  contacts: string;
  telegram: string;
  menu: string;
  shortTitle: string;
  subtitle: string;
  more: string;
}

export interface MapNode {
  label: string;
  desc: string;
  href: string;
}

export interface MapTranslation {
  heading: string;
  description: string;
  nodes: MapNode[];
}

export interface FooterTranslation {
  description: string;
  linksLabel: string;
  materialsLabel: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
  copyright: string;
  by: string;
  address: string;
  telegram: string;
  telegramUrl: string;
}

export interface PublicationsTranslation {
  badge: string;
  title: string;
  desc: string;
  back: string;
  search: string;
  all: string;
  reset: string;
  empty: string;
  normalView: string;
  compactView: string;
  rubric: string;
  clear: string;
  read: string;
  section: string;
  noPosts: string;
  rubrics: Record<string, string>;
}

export interface GlossaryTranslation {
  badge: string;
  title: string;
  relatedHeading: string;
  relatedCards: Array<{
    title: string;
    description: string;
    label: string;
  }>;
}

export interface RoadmapTranslation {
  heading: string;
  relatedCards: Array<{
    title: string;
    description: string;
    label: string;
  }>;
}

export interface ArchiveTranslation {
  badge: string;
  title: string;
  desc: string;
  label: string;
  items: Array<{
    title: string;
    description: string;
  }>;
}

export interface PostTranslation {
  back: string;
  backLabel: string;
  readOriginal: string;
  read: string;
  otherPosts: string;
  fromSection: string;
  ariaRead: string;
}

export interface SiteNoticeTranslation {
  publications: string;
  glossary: string;
  disciplines: string;
}

export interface GlossaryUITranslation {
  termOfDay: string;
  searchLabel: string;
  searchPlaceholder: string;
  alphabetFilter: string;
  all: string;
  categoryFilter: string;
  filtersLabel: string;
  relatedLabel: string;
  sort: string;
  random: string;
  nothingFound: string;
  resetFilters: string;
  tryChanging: string;
  randomTermLabel: string;
  showMore: string;
  collections: string;
  collectionsDesc: string;
  foundCount: string;
  relatedMaterials: string;
  relatedCard1Title: string;
  relatedCard1Desc: string;
  relatedCard2Title: string;
  relatedCard2Desc: string;
  relatedCard3Title: string;
  relatedCard3Desc: string;
  colFirstYear: string;
  colFirstYearDesc: string;
  colCoursework: string;
  colCourseworkDesc: string;
  colPsychodiagnostics: string;
  colPsychodiagnosticsDesc: string;
  colSocialPsychology: string;
  colSocialPsychologyDesc: string;
  colClinicalPsychology: string;
  colClinicalPsychologyDesc: string;
  colNeuropsychology: string;
  colNeuropsychologyDesc: string;
  colPsychoeducation: string;
  colPsychoeducationDesc: string;
  colNegotiationPsychology: string;
  colNegotiationPsychologyDesc: string;
}

export interface RoadmapUITranslation {
  backToHome: string;
  badge: string;
  heading: string;
  headingLine2: string;
  description: string;
  actions: string;
  links: string;
  result: string;
  done: string;
  mark: string;
  completed: string;
  reset: string;
}

export interface DisciplinesUITranslation {
  bachelor: string;
  master: string;
  program: string;
  course: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  searchLabel: string;
  nothingFound: string;
  reset: string;
  tryChanging: string;
  subjects: string;
  foundCount: string;
}

export interface ContactsUITranslation {
  extraContacts: string;
  officialLinks: string;
  additionalOfficialContacts: string;
}

export interface SiteTranslation {
  appName: string;
  description: string;
  hero: HeroTranslation;
  map: MapTranslation;
  trending: string;
  trendingSubtitle: string;
  trendingCta: string;
  contact: ContactTranslation;
  nav: NavTranslation;
  footer: FooterTranslation;
  publications: PublicationsTranslation;
  glossary: GlossaryTranslation;
  roadmap: RoadmapTranslation;
  archive: ArchiveTranslation;
  post: PostTranslation;
  siteNotice: SiteNoticeTranslation;
  glossaryUI: GlossaryUITranslation;
  roadmapUI: RoadmapUITranslation;
  disciplinesUI: DisciplinesUITranslation;
  contactsUI: ContactsUITranslation;
}
