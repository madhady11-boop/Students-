export type EngineId =
  | 'poster-analyzer'
  | 'sports'
  | 'khatib'
  | 'radoud'
  | 'education'
  | 'personal'
  | 'storefront'
  | 'logo-typography'
  | 'color-palette'
  | 'prompt-vault';

export interface EngineConfig {
  id: EngineId;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  accentColor: string;
  badge?: string;
  isNew?: boolean;
}

export interface SavedAnalysis {
  id: string;
  title: string;
  timestamp: number;
  engineId?: string;
  posterImage?: string;
  playerImage?: string;
  analysisText: string;
  aspectRatio: string;
  renderEngine: string;
  colors?: string[];
  eventType?: string;
  playerName?: string;
  teamName?: string;
}

export interface SamplePoster {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  base64Data: string;
  mimeType: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: string;
  error?: string;
}
