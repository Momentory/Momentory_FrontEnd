export interface CulturalStampRequest {
  spotName: string;
}

export interface CulturalStampResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

export interface RecentStampItem {
  stampId: number;
  region: string;
  spotName: string;
  type: 'REGIONAL' | 'CULTURAL' | string;
  issuedAt: string;
}

export interface RecentStampsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RecentStampItem[];
  totalRegionalCount?: number;
  totalCulturalCount?: number;
}
