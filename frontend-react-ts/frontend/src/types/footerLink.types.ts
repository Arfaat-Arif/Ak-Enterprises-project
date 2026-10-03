export interface FooterLink {
  id: number;
  groupName: string;
  label: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FooterLinkPayload {
  groupName: string;
  label: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
}
