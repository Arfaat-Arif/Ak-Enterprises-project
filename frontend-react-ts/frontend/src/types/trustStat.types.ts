export interface TrustStat {
  id: number;
  label: string;
  value: number;
  suffix: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface TrustStatPayload {
  label: string;
  value: number;
  suffix: string;
  sortOrder: number;
  isActive: boolean;
}
