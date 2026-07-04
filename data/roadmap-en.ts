import type { RoadmapStep } from "./roadmap";

export const roadmapStepsEn: RoadmapStep[] = [
  {
    step: 1,
    title: "Choose a direction",
    description:
      "Look at different areas of psychology: cognitive, social, clinical, organisational or developmental. Think about what interests you.",
    actions: [
      "See what topics exist in psychology",
      "Figure out what interests you most",
      "Talk to lecturers and senior students",
      "Attend a student research society meeting",
    ],
    links: [
      { title: "History of the programme", url: "/history" },
      { title: "Archive and traditions", url: "/archive" },
      { title: "Thematic collections", url: "/glossary" },
    ],
    result: "Understanding of a possible topic and the next step",
  },
  {
    step: 2,
    title: "Explore the literature",
    description:
      "Read foundational works on your topic: textbooks, monographs, classic articles. Build your initial bibliography.",
    actions: [
      "Find textbooks and monographs on your topic",
      "Read classic articles in academic journals",
      "Compile a reference list",
      "Note key ideas and approaches",
    ],
    links: [
      { title: "Glossary of terms", url: "/glossary" },
      { title: "Archive and traditions", url: "/archive" },
      { title: "Publications", url: "/publications" },
    ],
    result: "A theoretical base with a primary bibliography",
  },
  {
    step: 3,
    title: "Define the problem",
    description:
      "Formulate your research question and working hypothesis. Determine what exactly you want to find out.",
    actions: [
      "Identify a gap in existing research",
      "Formulate a question you want to answer",
      "Propose a hypothesis — your assumption",
      "Define the object, subject, aim and objectives",
    ],
    links: [
      {
        title: "Publications",
        url: "/publications",
      },
      { title: "History of the programme", url: "/history" },
    ],
    result:
      "A complete research framework: question, hypothesis, aim and objectives",
  },
  {
    step: 4,
    title: "Choose methods",
    description:
      "Select methods and specific techniques for your goal. Check validity, reliability and ethics.",
    actions: [
      "See what methods are available",
      "Choose techniques for your hypothesis",
      "Check their validity and reliability",
      "Discuss the design with your supervisor",
    ],
    links: [
      { title: "Glossary of terms", url: "/glossary" },
      { title: "Archive and traditions", url: "/archive" },
    ],
    result: "A thought-through design with a set of techniques for your task",
  },
  {
    step: 5,
    title: "Collect data",
    description:
      "Run a pilot study and then the main research. Collect data and keep protocols.",
    actions: [
      "First test the methods on a small sample",
      "Adjust the procedure after the pilot",
      "Conduct the main data collection",
      "Keep protocols and organise everything",
    ],
    links: [
      { title: "Archive and traditions", url: "/archive" },
      {
        title: "Publications",
        url: "/publications",
      },
    ],
    result: "Collected empirical material for processing",
  },
  {
    step: 6,
    title: "Analyse and interpret",
    description:
      "Process the data using statistics. Interpret the results — what they mean in the context of your topic.",
    actions: [
      "Choose which statistical methods to apply",
      "Conduct quantitative and qualitative analysis",
      "See what the results tell you about your hypothesis",
      "Formulate the main conclusions",
    ],
    links: [
      { title: "Glossary of terms", url: "/glossary" },
      { title: "Archive and traditions", url: "/archive" },
    ],
    result: "Substantiated conclusions — what the results show",
  },
  {
    step: 7,
    title: "Present the results",
    description:
      "Present your findings in a talk or slides. Speak at a seminar or conference and discuss the results.",
    actions: [
      "Prepare a presentation text",
      "Prepare a talk or slides",
      "Speak at the 'Psychology in the Modern World' conference",
      "Prepare material for discussion",
    ],
    links: [
      { title: "Publications", url: "/publications" },
      { title: "Archive and traditions", url: "/archive" },
    ],
    result:
      "A ready talk or presentation for an educational or scientific project",
  },
];
