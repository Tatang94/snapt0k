
export interface VideoData {
  id: string;
  title: string;
  author: string;
  cover: string;
  downloadUrl: string;
  playCount: number;
  duration: string;
  isNoWatermark: boolean;
}

export interface AnalysisResult {
  summary: string;
  hashtags: string[];
  sentiment: string;
  engagementTips: string[];
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  date: number;
}
