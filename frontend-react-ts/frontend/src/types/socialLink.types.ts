export interface SocialLink {
  id: number;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface SocialLinkPayload {
  platform: string;
  label: string;
  url: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}
