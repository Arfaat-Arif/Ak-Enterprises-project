export interface PageContent {
  id: number;
  pageKey: string;
  sectionKey: string;
  content: string | null;
  isActive: boolean;
}

export interface PageContentPayload {
  pageKey: string;
  sectionKey: string;
  content: string;
  isActive: boolean;
}

export interface PageContentMap {
  [key: string]: string | null;
}
