export interface WorkArchiveFolder {
  id: string;
  label: string;
  description: string;
  projectIds: string[];
  folders?: WorkArchiveFolder[];
}

export const workArchiveFolders: WorkArchiveFolder[] = [
  {
    id: "publications",
    label: "Publications",
    description: "Research papers and manuscripts.",
    projectIds: ["pact"],
  },
  {
    id: "presentations",
    label: "Presentations",
    description: "Talks, seminars, and study presentations.",
    projectIds: ["aspai-pachita"],
    folders: [
      {
        id: "newcomer-study",
        label: "Newcomer Study",
        description: "Research papers presented during the BAE LAB newcomer study.",
        projectIds: ["time-series-clustering-study", "predictive-process-monitoring-study"],
      },
    ],
  },
  {
    id: "competitions",
    label: "Competitions",
    description: "Competition entries and award-winning data projects.",
    projectIds: [
      "veterans-hospital-analysis",
      "minimum-wage-impact-analysis",
      "wind-power",
      "pressure-index",
      "kb-ai",
      "family-policy",
    ],
  },
  {
    id: "industry-projects",
    label: "Industry Projects",
    description: "Projects developed with or for industry partners.",
    projectIds: ["ai-work-instruction", "k-recipe2vec"],
  },
  {
    id: "side-projects",
    label: "Side Projects",
    description: "Independent projects built outside coursework and professional work.",
    projectIds: ["mino"],
  },
];
