export type TableOfContentsEntry = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export type GuidebookDocument = {
  slug: string;
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  content: string;
  tableOfContents: TableOfContentsEntry[];
};
