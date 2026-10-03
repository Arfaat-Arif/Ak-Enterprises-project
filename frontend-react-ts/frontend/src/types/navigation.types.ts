export interface NavigationItem {
  id: number;
  label: string;
  url: string;
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
  children: NavigationItem[];
}

export interface NavigationItemPayload {
  label: string;
  url: string;
  parentId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
  openInNewTab?: boolean;
}
