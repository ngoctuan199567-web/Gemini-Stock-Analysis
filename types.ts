export interface StockHistoryItem {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  changePercent: number;
  volume: string;
  turnover: string;
  turnoverRate: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  currency: string;
  changeAmount: number;
  changePercent: number;
  lastUpdated: string;
  history: StockHistoryItem[];
  trendAnalysis: {
    summary: string;
    supportLevels: string[];
    resistanceLevels: string[];
  };
  volumeAnalysis: {
    volume: string;
    assessment: string;
  };
  riskAssessment: {
    volatility: string;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
    description: string;
  };
  priceTargets: {
    shortTerm: string;
    midTerm: string;
  };
  technicalLevels: {
    summary: string;
    indicators: string[]; // e.g., "RSI: 60 (Neutral)", "MACD: Bullish"
  };
  tradingAdvice: {
    action: 'Buy' | 'Sell' | 'Hold' | 'Wait';
    entryZone: string;
    stopLoss: string;
    rationale: string;
  };
  sources?: GroundingSource[];
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: StockData | null;
  error: string | null;
}